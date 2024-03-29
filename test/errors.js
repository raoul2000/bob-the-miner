"use strict";

const assert = require("chai").assert;
const bob = require("../index");

describe("when errors happen", function () {
    this.timeout(0);
    it("returns NULL when selector doesn't match any element", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", "h5")
            .then((result) => {
                assert.isNull(result);
                done();
            })
            .catch(done);
    });

    it("promise rejected  when selector syntax is incorrect", (done) => {
        bob.work("http://127.0.0.1:8080/blog/index.html", "!")
            .then((result) => {
                done("should be rejected");
            })
            .catch(() => done());
    });

    it("promise rejected when request returns 404", (done) => {
        bob.work("http://127.0.0.1:8080/blog/NOT_FOUND.html", "!")
            .then((result) => {
                done("should be rejected");
            })
            .catch(() => done());
    });

    it("promise rejected when URL is invalid", (done) => {
        bob.work("/blog/NOT_FOUND.html", "!")
            .then((result) => {
                done("should be rejected");
            })
            .catch(() => done());
    });
});
