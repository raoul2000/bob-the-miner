
# Options

> *Options* is when you give extra instructions to bob on how to do his job

## Overview

If you want to change the default behavior of Bob when mining data for you, you can do so by passing a third argument to the *work* function. This third argument is an object that Bob can understand when correctly set.

Here is an example : 

```js
const bob = require('bob-the-miner');

bob.work(
    'https://www.my-cool-website.com/some-page.html', 
    "h1.story-heading", 
    {... the options here ...}
);
```

## Option list

### verbose

If you can't stand the silence while Bob is mining your data, you can ask him to inform you about what he is doing. Don't expect too much though, even in verbose mode "Silent Bob" will not overload you with blablabla...

```js
bob.work(
    'https://www.my-cool-website.com/some-page.html', 
    "h1.story-heading", 
    {
        verbose: true
    }
);
```

### onMinedData

This option allows you to provide a function that will be called after each data extraction. It accepts 2 arguments : the URL that was mined and the data extracted. For example You can use this function to clean up the data and then save it to a file.

```js
bob.work(
    'https://www.my-cool-website.com/some-page.html', 
    "h1.story-heading", 
    {
        onMinedData: (url, minedData) => console.log(`done with ${url}`)
    }
);
```

### indexByUrl

This options changes the shape of the data returned by Bob, When it is set to `true`, Bob will returns an object where keys are URL of pages and the value is the data extracted from the page. This can be useful in particular when you ask Bob to mine a list of URL.

For example :
```js
bob.work(
    [
        'https://www.my-cool-website.com/some-page.html',
        'https://www.my-cool-website.com/some-other-page.html'
    ], 
    "h1.story-heading", 
    {
        indexByUrl: true
    }
);
```

The returned data will look like this : 

```json
{
    "https://www.my-cool-website.com/some-page.html" : "the extracted data here",
    "https://www.my-cool-website.com/some-other-page.html" : "the extracted data here"
}
```

### appendUrlAsProperty

Just like the previous option, this one changes the shape of the returned data. This time, the object returned will contain 2 properties : `_pageUrl` and `_minedData`.

For example :
```js
bob.work(
    'https://www.my-cool-website.com/some-page.html',       
    "h1.story-heading", 
    {
        appendUrlAsProperty: true
    }
);
```

The returned data will look like this : 

```json
{
    "_pageUrl":  "https://www.my-cool-website.com/some-page.html",
    "_minedData" : "the extracted data here"
}
```

### puppeteer

To be able to do his job, Bob uses tools and one of the most important tool is [Pupeteer](https://pptr.dev/). If you want to change settings in the way Bob uses Pupeteer, the `pupeteer` option is for you. It is an object at most 2 properties : 

- `launchOptions` : launch option object as described in the [LaunchOptions doc](https://pptr.dev/api/puppeteer.puppeteerlaunchoptions). The default value is `{headless: "new"}`
- `pageOptions` : page goto option object as  described in [Page.goto() doc](https://pptr.dev/api/puppeteer.page.goto). The default value is `{waitUntil: "networkidle0"}`

> playing with Pupeteer options is not something you want to do if you don't understand how this tool works, so use with care or you'll break Bob's work.

For example :

```js
bob.work(
    'https://www.my-cool-website.com/some-page.html',       
    "h1.story-heading", 
    {
        puppeteer : {
            launchOptions : {
                headless : false
            }
        },
    }
);
```

This example will cause a browser to open so you can spy Bob while he is mining data for you.

### maxUrl

This option is useful when the itinerary is in fact an extraction plan to produce a list of URL. Using `maxUrl` option, you can limit the number of mining job to a given value. For example, if your extraction plan returns 500 URL and you only want to work on 10 of them, then `maxUrl` is your friend.

For example : 

```js
bob.work(
    // my extraction plan that will return 500 urls
    {
        url: "http://hostname/blog/index.html",
        plan: {
            selector: ["div.post a"],
            type: "@href absolute",
        },
    },
    "h1.story-heading", 
    {
        maxUrl : 10 // only 10 URL will be mined by Bob
    }
);
```

### maxPage

Again this options is useful when you ask Bob to mine several pages at the same time. By using `maxPage` you can limit the number of simultaneous pages that Bob is mining **at the same time**. Yes, because if you didn't know, Bob is indeed able to work on several pages at the same time but if the number of pages is high, then maybe your computer will start to heat up. 

For example : 

```js
bob.work(
    // I want bob to mine all these pages
    [
        "https://www.my-cool-site.com/live/2024/07/30/us/harris-election",
        "https://www.my-cool-site.com/2024/07/30/us/politics/kamrris-vp-pick.html",
        "https://www.my-cool-site.com/2024/07/30/business/chineses-thailand.html",
        "https://www.my-cool-site.com/2024/07/30/business/japland-cars.html",
        "https://www.my-cool-site.com/2024/07/30/world/europe/sothpspect.html",
        "https://www.my-cool-site.com/live/2024/07/30/world/olympics-simone-biles",
    ],
    "h1.story-heading", 
    {
        maxPage : 2 // ... but to only mine 2 at the same time
    }
);
```


