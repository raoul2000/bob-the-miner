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
    //console.log(JSON.stringify(result.data));
    const regex = /.*Programme(.*)\n/gm;
    const regex2 = /.* (.*)\n/gm;
    let res2 = result.data.item.map( prog => {
        let channel = prog.channel;
        let match = prog.channel.match(regex);
        if( match ) {
            channel = match[1];
        } 
        return {
            "channel" : channel,
            "programme" : prog.programme.map( p => {
                let name = p.name;
                let m2 = name.match(regex2);
                if( m2 ) {
                    name = m2[1];
                }
                return {
                    "name" : name,
                    "hour" : p.hour
                };
            })
        }
    });
    console.log(JSON.stringify(res2));
  })
  .catch(err => {
    console.err(err);
  });
