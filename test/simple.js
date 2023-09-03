"use strict";

const assert = require("chai").assert;
const bob = require("../index");

describe("objects properties as simple value", (done) => {
    it("returns a single value", () =>
        assert(bob.work("http://127.0.0.1:8080/blog/index.html", "h1")).should.eventually.equal(4));
});

/*
        .then((result) =>
            assert.deepEqual(result, {
                url: "http://127.0.0.1:8080/blog/index.html",
                minedData: "My Blog",
            })
        );

        */
