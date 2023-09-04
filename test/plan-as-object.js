"use strict";

const assert = require("chai").assert;
const bob = require("../index");

describe("when the extraction plan is an object", function () {
    this.timeout(0);
    it("returns first title + sub-head as object", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", {
            title: "div.post > h2",
            subHead: "div.post > div.sub-head",
        })
            .then((result) => {
                assert.deepEqual(result, {
                    title: "Welcome Bob the Web Miner",
                    subHead:
                        "\n          sub-head here ! Lorem ipsum dolor sit amet,\n          consectetur adipisicing elit,s irure dolor in reprehenderit in\n          voluptate velit esse cillum dolore eu fugiat\n          \n          read more ...\n        ",
                });
                done();
            })
            .catch(done);
    });
    it("returns all title + sub-head as objects", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", {
            articles: {
                selector: ["div.post"],
                type: {
                    title: "h2",
                    subHead: "div.sub-head",
                    url: {
                        selector: "a",
                        type: "@href absolute",
                    },
                },
            },
        })
            .then((result) => {
                assert.deepEqual(result, {
                    articles: [
                        {
                            title: "Welcome Bob the Web Miner",
                            subHead:
                                "\n          sub-head here ! Lorem ipsum dolor sit amet,\n          consectetur adipisicing elit,s irure dolor in reprehenderit in\n          voluptate velit esse cillum dolore eu fugiat\n          \n          read more ...\n        ",
                            url: "http://127.0.0.1:8080/blog/post/1.html",
                        },
                        {
                            title: "Scraper community : a new kid is on the block",
                            subHead:
                                "\n          another sub-head here !\n          \n          read more ...\n        ",
                            url: "http://127.0.0.1:8080/blog/post/2.html",
                        },
                        {
                            title: "The Lost Post",
                            subHead:
                                "\n          This one has an invalid url to the body content (too bad!)\n          \n          read more ...\n        ",
                            url: "http://127.0.0.1:8080/blog/post/NOT_FOUND.html",
                        },
                    ],
                });
                done();
            })
            .catch(done);
    });
});
