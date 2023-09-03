const puppeteer = require("puppeteer");
const pLimit = require("p-limit");

/**
 * Opens and returns a page at the given url.
 *
 * Throws when request doesn't return HTTP 200.
 *
 * @param {string} url page url to open in the browser
 * @param {puppeteer.Browser} browser Browser instance
 * @returns Promise<puppeteer.Page>
 */
const openPage = (url, browser) =>
    browser
        .newPage()
        .then((page) =>
            page.goto(url, { waitUntil: "networkidle2" }).then((response) => {
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
                        return [...rootElement.querySelectorAll(selector[0])].map((el) =>
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
                result = [...rootElement.querySelectorAll(selector[0])].map(valueTypeReader);
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
        try {
            console.log("starting data mining from page");
            const finalResult = _extractFromPage(plan);
            console.log("done with data mining from page");
            return finalResult;
        } catch (error) {
            console.log("ERROR : data mining failed" + error);
        }
    }, plan);
    return extractedData;
};

const mineUrl = (url, plan, browser) => {
    console.log(`mining : ${url}`);
    return openPage(url, browser).then((page) => minePage(page, plan).finally(() => page.close()));
};

const defaultMinedDataHandler = (url, minedData) => console.log(JSON.stringify({ url, minedData }, null, 4));

/**
 * Extract data from one or more pages.
 *
 * @param {string|string[]|object} url describes the URL of the page to mine
 * @param {string | string[] | object} plan  the data extraction plan applied to the page
 * @param {object?} options running options
 * @returns
 */
const run = (url, plan, options) =>
    puppeteer
        .launch({ headless: "new", devtools: false })
        .then((browser) => {
            if (Array.isArray(url) || typeof url === "string") {
                return Promise.resolve({ urlToMine: url, browser });
            } else if (typeof url === "object") {
                // TODO: validate URL plan
                return mineUrl(url.url, url.plan, browser).then((extractedUrl) => ({
                    urlToMine: extractedUrl,
                    browser,
                }));
            }
        })
        .then(({ urlToMine, browser }) => {
            let minigJob;
            if (Array.isArray(urlToMine)) {
                const limit = pLimit(options?.maxPage ?? 10);
                minigJob = Promise.all(
                    urlToMine.map((thisUrl) =>
                        limit(() =>
                            mineUrl(thisUrl, plan, browser).then((minedData) => {
                                (options?.onMinedData ?? defaultMinedDataHandler)(thisUrl, minedData);
                                return minedData;
                            })
                        )
                    )
                );
            } else {
                minigJob = mineUrl(urlToMine, plan, browser).then((minedData) => {
                    (options?.onMinedData ?? defaultMinedDataHandler)(urlToMine, minedData);
                    return minedData;
                });
            }
            return minigJob.finally(() => browser.close().then(() => console.log("browser closed")));
        })
        .catch((error) => console.log(JSON.stringify(error, null, 4)));

exports.start = run;

/*
run("http://127.0.0.1:8080/blog/index.html", "!h2").then((result) =>
    console.log("result = " + JSON.stringify(result, null, 4))
).catch(error => console.error('ERROR'));
*/

