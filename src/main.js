const puppeteer = require("puppeteer");
const pLimit = require("p-limit");

/**
 * Opens and returns a page at the given url.
 *
 * Throws when request doesn't return HTTP 200.
 *
 * @param {string} url page url to open in the browser
 * @param {puppeteer.Browser} browser Browser instance
 * @param {object?} options Puppeteer Page.goto options (see https://pptr.dev/api/puppeteer.page.goto)
 * @returns Promise<puppeteer.Page>
 */
const openPage = (url, browser, options) =>
    browser
        .newPage()
        .then((page) =>
            page.goto(url, { waitUntil: "networkidle0", ...options }).then((response) => {
                if (response.status() !== 200) {
                    throw new Error(`page load request returned status ${response.status()}`, { cause: url });
                }
                return page;
            })
        )
        .then((page) => page.waitForSelector("body").then(() => page));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Mine data into the given *page* following the given *plan*.
 *
 * @param {puppeteer.Page} page the Page to mine
 * @param {*} plan mining plan to apply to the page
 * @returns Promise<any>
 */
const minePage = async (page, plan) => {
    const extractedData = await page.evaluate((plan) => {
        const _extractFromPage = (selector, type = "text", rootElement = document) => {
            if (!selector) {
                throw new Error("trying to extract data with a NULL selector");
            }

            /**
             * Helper function to turn a possibly relative url into an absolute url
             * relatively to the page.
             *
             * @param {string} url the url to resolve
             * @returns string the absolute url
             */
            const resolveUrl = (url) => {
                const anchor = document.createElement("a");
                anchor.setAttribute("href", url);
                return anchor.href;
            };

            const takeFirst = (arr, n) => n ? arr.slice(0, n-1) : arr;

            let result;
            let valueTypeReader = (el) => el.textContent;
            if (type) {
                if (typeof type === "string" && type?.startsWith("@") && type.length > 1) {
                    // type = "@attributeName"
                    const normalized = type.substring(1).trim();
                    const [attrName, modificator] = normalized.split(" ").filter((s) => s.length !== 0);
                    if (modificator === "absolute") {
                        valueTypeReader = (el) => resolveUrl(el.getAttribute(attrName));
                    } else {
                        valueTypeReader = (el) => el.getAttribute(attrName);
                    }
                } else if (typeof type === "object") {
                    // {type: {...}}
                    if (Array.isArray(selector)) {
                        const selectedElements = takeFirst([...rootElement.querySelectorAll(selector[0])]);
                        return selectedElements.map((el) =>
                            _extractFromPage(type, null, el)
                        );
                    } else {
                        const newRootElement = rootElement.querySelector(selector);
                        return newRootElement && _extractFromPage(type, null, newRootElement);
                    }
                }
            }

            if (typeof selector === "string") {
                const el = rootElement.querySelector(selector);
                result = el && valueTypeReader(el);
            } else if (Array.isArray(selector) && selector.length !== 0) {
                const selectedElements = takeFirst([...rootElement.querySelectorAll(selector[0])]);
                result = selectedElements.map(valueTypeReader);
            } else if (selector && typeof selector === "object") {
                const selectorObj = selector;
                if (selectorObj.hasOwnProperty("selector")) {
                    result = _extractFromPage(selectorObj.selector, selectorObj.type, rootElement);
                } else {
                    result = Object.entries(selectorObj)
                        .map(([propName, aSelector]) => ({
                            name: propName,
                            data: _extractFromPage(aSelector, type, rootElement),
                        }))
                        .reduce((acc, { name, data }) => {
                            acc[name] = data;
                            return acc;
                        }, {});
                }
            }
            return result;
        };

        // start extraction function
        // for now this feature has no obvious usage and deserve some more analysis
        // i.e it is not exposed to user config
        const timeoutBeforeExtractionMs = 0;
        if (timeoutBeforeExtractionMs) {
            console.log(`data extraction will start after ${timeoutBeforeExtractionMs}ms timeout`);
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    console.log(`starting data mining from page (${window.location.href})`);
                    const finalResult = _extractFromPage(plan);
                    console.log(`done with data mining from page (${window.location.href})`);
                    resolve(finalResult);
                } catch (error) {
                    console.error(`data mining failed (${window.location.href}) : ${error}`);
                    reject(error);
                }
            }, timeoutBeforeExtractionMs);
        });
    }, plan);
    return extractedData;
};

const mineUrl = async (url, plan, browser, options) => {
    options?.verbose && console.log(`mining : ${url}`);
    return openPage(url, browser, options?.puppeteer?.pageOptions).then((page) => {
        page.on("console", (message) => {
            if (options?.verbose) {
                console.log(`browser (${message.type()}) : ${message.text()}`);
            }
        });
        return minePage(page, plan).finally(() => page.close());
    });
};

const packageMinedData = (options, minedUrl, minedData) => {
    // append page url ?
    let dataForm = options?.appendUrlAsProperty ? { _pageUrl: minedUrl, _minedData: minedData } : minedData;

    // index by page Url ?
    if (options?.indexByUrl) {
        const pkg = {};
        pkg[minedUrl] = dataForm;
        return pkg;
    } else {
        return dataForm;
    }
};

const postMiningJob = (minedUrl, minedData, options) => {
    const pkgData = packageMinedData(options, minedUrl, minedData);
    if (options?.onMinedData) {
        options.onMinedData(minedUrl, pkgData);
    }
    if (options?.verbose) {
        console.log(`url  : ${minedUrl}`);
        console.log(`data : \n${JSON.stringify(minedData, null, 4)}`);
        console.log("--------------------------------------------------");
    }
    return pkgData;
};

/**
 * Extract data from one or more pages.
 *
 * Available options:
 * - **indexByUrl**: (boolean, default = FALSE) - when TRUE, each mining job returns an object with one key being the
 * mined URL , and the mined data as value.
 * - **maxUrl** : max number of Url to scrape. This option is enabled when the url to mine is an array or an extraction plan
 * that returns an array of Url. Be aware that in this last case, there is no garantee the first **maxUrl** will be 
 * processed as there is no order determined in case of extraction plan
 * - **appendUrlAsProperty**: (boolean, default = FALSE) - when TRUE, each mining job returns an object with 2 properties:
 *   - `_pageUrl` : the URL of the page that was mined
 *   - `_minedData` : the data mined from the page
 * - **maxPage**: (number, default = 10) - max number of concurrent mining jobs. Use this option to limit resources
 * consumption when a lot of url have to be mined.
 * - **onMinedData** (function, default to console) - function invoked immediately after each mining job is
 * done. The first argument is the mined URL, the second argument is the mined data.
 * - **verbose** (boolean, default = FALSE) - when TRUE, log messages are written to stdout
 * - **puppeteer.launchOptions** (object, default = {headless: "new"} ) - Puppteer  launch option object as described in
 * https://pptr.dev/api/puppeteer.puppeteerlaunchoptions
 * - **puppeteer.pageOptions** (object, default = {waitUntil: "networkidle0"} ) - Puppteer  page goto option object as 
 * described in https://pptr.dev/api/puppeteer.page.goto
 *
 * @param {string|string[]|object} url describes the URL of the page to mine
 * @param {string | string[] | object} plan  the data extraction plan applied to the page
 * @param {object?} options running options
 * @returns
 */
const run = (url, plan, options) =>
    puppeteer
        .launch({ headless: "new", ...options?.puppeteer?.launchOptions })
        .then((browser) => {
            if (Array.isArray(url) || typeof url === "string") {
                return Promise.resolve({ urlToMine: url, browser });
            } else if (typeof url === "object") {
                // TODO: validate URL plan
                return mineUrl(url.url, url.plan, browser, options).then((extractedUrl) => ({
                    urlToMine: extractedUrl,
                    browser,
                }));
            }
        })
        .then(({ urlToMine, browser }) => {
            let minigJob;
            if (Array.isArray(urlToMine)) {
                let urlList = urlToMine;
                if(options?.maxUrl > 0) {
                    urlList = urlToMine.slice(0,options.maxUrl);
                }
                const limit = pLimit(options?.maxPage ?? 10);
                minigJob = Promise.all(
                    urlList.map((thisUrl) =>
                        limit(() =>
                            mineUrl(thisUrl, plan, browser, options).then((minedData) => {
                                return postMiningJob(thisUrl, minedData, options);
                            })
                        )
                    )
                );
            } else {
                minigJob = mineUrl(urlToMine, plan, browser, options).then((minedData) => {
                    return postMiningJob(urlToMine, minedData, options);
                });
            }
            return minigJob.finally(() =>
                browser.close().then(() => options?.verbose && console.log("browser closed"))
            );
        })
        .catch((error) => {
            options?.verbose && console.error(`ERROR : ${error.message}`);
            throw error;
        });

exports.start = run;
/*
run("http://localhost:8080/list.html", { selector: ["li"], max: 2, type: "@attr" })
    .then((result) => console.log(JSON.stringify(result, null, 4)))
    .catch(console.error);

    */
