"use strict";

const assert = require("chai").assert;
const bob = require("../index");

describe("extract typed values", function () {
    this.timeout(0);
    it("returns text content when no type is specified", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", { selector: "a" })
            .then((result) => {
                assert.deepEqual(result, "read more ...");
                done();
            })
            .catch(done);
    });
    it("returns attribute value", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", { selector: "a", type: "@class" })
            .then((result) => {
                assert.deepEqual(result, "link-1");
                done();
            })
            .catch(done);
    });
    it("returns several attribute value", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", { selector: ["a"], type: "@class" })
            .then((result) => {
                assert.deepEqual(result, ["link-1", "link-2", "link-3"]);
                done();
            })
            .catch(done);
    });
    it("returns absolute URL", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", { selector: "a", type: "@href absolute" })
            .then((result) => {
                assert.deepEqual(result, "http://127.0.0.1:8080/blog/post/1.html");
                done();
            })
            .catch(done);
    });
    it("returns several absolute URL", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", { selector: ["a"], type: "@href absolute" })
            .then((result) => {
                assert.deepEqual(result, [
                    "http://127.0.0.1:8080/blog/post/1.html",
                    "http://127.0.0.1:8080/blog/post/2.html",
                    "http://127.0.0.1:8080/blog/post/NOT_FOUND.html",
                ]);
                done();
            })
            .catch(done);
    });
    it("returns several relative URL", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", { selector: ["a"], type: "@href" })
            .then((result) => {
                assert.deepEqual(result, ["post/1.html", "post/2.html", "post/NOT_FOUND.html"]);
                done();
            })
            .catch(done);
    });
});
