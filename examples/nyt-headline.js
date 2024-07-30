"use strict";

const bob = require("../index");

bob.work("https://www.nytimes.com/", ["section.story-wrapper > a > div > div"])
    .then((result) => {
        console.log(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
        console.error(err);
    });
