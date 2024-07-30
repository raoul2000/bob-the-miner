"use strict";

const bob = require("../index");

bob.work(
    [
        "https://www.nytimes.com/live/2024/07/30/us/harris-trump-election",
        "https://www.nytimes.com/2024/07/30/us/politics/kamala-harris-vp-pick.html",
        "https://www.nytimes.com/2024/07/30/business/chinese-electric-vehicles-thailand.html",
        "https://www.nytimes.com/2024/07/30/business/japan-thailand-cars.html",
        "https://www.nytimes.com/2024/07/30/world/europe/southport-stabbing-uk-suspect.html",
        "https://www.nytimes.com/live/2024/07/30/world/olympics-gymnastics-simone-biles",
    ],
    ["h1"],
    {
        maxPage: 5,
        verbose: false,
        appendUrlAsProperty: true,
        puppeteer: {
            launchOptions: {
                headless: false,
            },
        },
        onMinedData: (url, data) => console.log(`done with ${url}`),
    }
)
    .then((result) => {
        console.log(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
        console.error(err);
    });
