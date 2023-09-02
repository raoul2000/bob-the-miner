"use strict";

const assert = require('chai').assert;
const miner = require('../src/miner');

describe('objects properties as object deep', function (done) {

    it('extracts property "post" with type object', function (done) {
        let result = miner.mine(
            {
                post: {
                    selector: "div.item",
                    type: {
                        info: {
                            selector: 'div.info',
                            type: {
                                mainTitle: "h1",
                                subTitle: 'h2'
                            }
                        },
                        text: {
                            selector: "div.body > p",
                            type: ['text']
                        }
                    }
                }
            },
            `
			<body>
                <div class="item">
                    <div class="info">
                        <h1>main title 1</h1>
                        <h2>sub title 1</h2>
                    </div>
					<div class="body">
    					<p> l1:body text </p>
                        <p> l2:body text </p>
                    </div>
				</div>
				<p> out of post text </p>
			</body>`
        );
        console.log(JSON.stringify(result));
        assert.deepEqual(result, {
            "post": { 
                "info": { 
                    "mainTitle": "main title 1", 
                    "subTitle": "sub title 1" 
                }, 
                "text": [
                    " l1:body text ", 
                    " l2:body text "
                ] 
            }
        });
        done();
    });
});
