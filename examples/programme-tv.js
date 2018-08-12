"use strict";

// this is a work in progress
// Attempt to extract french TV programs from website

const bob = require('../index');
const URL = 'https://www.programme-tv.net/programme/free-13/';
//const URL = 'http://127.0.0.1:8080/programme-tv.html';

bob.work(URL, 
    {
        "item" : {
            "selector" : 'div.p-v-md',
            'type' : [{
                "channel" :  'a.channel_label',
                "logo" : {
                    "selector" : '.channel_logo > img.m-auto.lazyloaded',
                    'type' : "@src"
                },
                "programme" : {
                    "selector" : "div.programme",
                    "type" : [{
                        "name" :   "a.prog_name",
                        "image" : {
                            "selector" : "img.prime_broadcast_image",
                            "type" : "@src"
                        },
                        "hour" : {"selector" : "div.prog_heure"}
                    }]
                }
            }]
        }  
    })
  .then(result => {
    console.log(JSON.stringify(result.data));
  })
  .catch(err => {
    console.err(err);
  });
