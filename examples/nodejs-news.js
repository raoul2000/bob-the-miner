"use strict";

const bob = require("../index");

bob.work(
    {
        url: "https://foundation.nodejs.org/en/blog",
        plan: { selector: ["ul.blog-index a"], type: "@href absolute" },
    },
    { title: "article h1", meta: "article span.blogpost-meta", text: ["article p"] }
)
    .then((result) => {
        console.log(JSON.stringify(result, null, 4));
        /*
        console.log("FROM : https://foundation.nodejs.org/news");
        console.log(`found ${result.data.post.length} news`);
        console.log("-------------------------------------");
        result.data.post.forEach((aPost) => {
            console.log(`====== ${aPost.title}`);
            if (aPost.body && aPost.body.length > 0) {
                console.log(`       ${aPost.body}`);
            }
        });*/
    })
    .catch((err) => {
        console.err(err);
    });
