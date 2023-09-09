"use strict";

const bob = require("../index");

bob.work("https://www.npmjs.com/search?q=crawler&ranking=popularity&page=0&perPage=20", {
    libraries: {
        selector: ["section"],
        type: {
            name: "div.flex.flex-row.items-end.pr3 h3",
            url: { selector: "div.flex.flex-row.items-end.pr3 a", type: "@href absolute" },
            description: "p",
        },
    },
})
    .then((result) => {
        console.log(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
        console.error(err);
    });
