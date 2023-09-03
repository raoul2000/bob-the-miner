"use strict";

const assert = require("chai").assert;
const bob = require("../index");

describe("extracts a list a values from a page", function () {
    this.timeout(0);
    it("returns an array with a single value", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", ["h1"])
            .then((result) => {
                assert.lengthOf(result, 1);
                assert.deepEqual(result[0], "My Blog");
                done();
            })
            .catch(done);
    });

    it("returns values for all h2 ", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", ["h2"])
            .then((result) => {
                assert.lengthOf(result, 3);
                assert.deepEqual(result, [
                    "Welcome Bob the Web Miner",
                    "Scraper community : a new kid is on the block",
                    "The Lost Post",
                ]);
                done();
            })
            .catch(done);
    });

    it("returns values for all h2 ", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", { selector: ["h2"] })
            .then((result) => {
                assert.lengthOf(result, 3);
                assert.deepEqual(result, [
                    "Welcome Bob the Web Miner",
                    "Scraper community : a new kid is on the block",
                    "The Lost Post",
                ]);
                done();
            })
            .catch(done);
    });
});
