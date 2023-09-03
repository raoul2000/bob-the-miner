"use strict";

const assert = require("chai").assert;
const bob = require("../index");

describe("objects properties as simple value", () => {
    it("returns a single value", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", "h1")
            .then((result) => {
                assert.deepEqual(result, "My Blog");
                done();
            })
            .catch(done);
    });

    it("returns the first h2 text content", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", "h2")
            .then((result) => {
                assert.deepEqual(result, "Welcome Bob the Web Miner");
                done();
            })
            .catch(done);
    });
    
});
