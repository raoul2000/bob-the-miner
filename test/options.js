"use strict";

const assert = require("chai").assert;
const bob = require("../index");

describe("web mining options : appendUrlAsProperty", function () {
    this.timeout(0);
    it("returns mined data with url property", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", "h2", {
            appendUrlAsProperty: true,
        })
            .then((result) => {
                assert.deepEqual(result, {
                    _pageUrl: "http://127.0.0.1:8080/blog/index.html",
                    _minedData: "Welcome Bob the Web Miner",
                });
                done();
            })
            .catch(done);
    });
});

describe("web mining options : indexByUrl", function () {
    this.timeout(0);
    it("returns mined data indexed by Url for single url", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", "h2", {
            indexByUrl: true,
        })
            .then((result) => {
                assert.deepEqual(result, {
                    "http://127.0.0.1:8080/blog/index.html": "Welcome Bob the Web Miner",
                });
                done();
            })
            .catch(done);
    });

    it("returns mined data indexed by Url for array of url (1)", (done) => {
        bob.work(["http://127.0.0.1:8080/blog/post/1.html", "http://127.0.0.1:8080/blog/post/2.html"], "h2", {
            indexByUrl: true,
        })
            .then((result) => {
                assert.deepEqual(result, [
                    { "http://127.0.0.1:8080/blog/post/1.html": "Welcome Bob the Web Miner" },
                    {
                        "http://127.0.0.1:8080/blog/post/2.html":
                            "Scraper community : a new kid is on the block",
                    },
                ]);
                done();
            })
            .catch(done);
    });
    it("returns mined data indexed by Url for array of url (2)", (done) => {
        bob.work(
            ["http://127.0.0.1:8080/blog/post/1.html", "http://127.0.0.1:8080/blog/post/2.html"],
            { title: "h2" },
            {
                indexByUrl: true,
            }
        )
            .then((result) => {
                assert.deepEqual(result, [
                    { "http://127.0.0.1:8080/blog/post/1.html": { title: "Welcome Bob the Web Miner" } },
                    {
                        "http://127.0.0.1:8080/blog/post/2.html": {
                            title: "Scraper community : a new kid is on the block",
                        },
                    },
                ]);
                done();
            })
            .catch(done);
    });
});

