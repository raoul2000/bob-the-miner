"use strict";

const assert = require("chai").assert;
const bob = require("../index");

describe("when an array of URL must be mined", function () {
    this.timeout(0);
    it("returns an array with a one value per URL unordered", (done) => {
        bob.work(["http://127.0.0.1:8080/blog/post/1.html", "http://127.0.0.1:8080/blog/post/2.html"], "h2")
            .then((result) => {
                assert.lengthOf(result, 2);
                assert.isTrue(result.indexOf("Scraper community : a new kid is on the block") !== -1);
                assert.isTrue(result.indexOf("Welcome Bob the Web Miner") !== -1);
                done();
            })
            .catch(done);
    });

});
