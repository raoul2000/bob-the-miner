
# Meet "Bob the Web Miner"

## Who is Bob ?

*Bob* is a miner, a "web" miner, which means that Bob doesn't digg the ground to extract minerals but the "World Wide Web" to extract data. To be able to do his job correctly, you need to give Bob 2 things : 
- a place to digg
- a description of how to extract data

For example, to ask Bob to extract the main title of the New-York Time home page, here is what you should do :

```js
const bob = require('bob-the-miner');

bob.work('https://www.nytimes.com/', "h1.story-heading > a")
  .then(result => { console.log(result.data)}) // display extracted data
  .catch(err   => { consoler.err(err)})
```

This was an easy one for Bob who is actually able to work much harder to try to satisfy your demand, but basically you get the idea :

- the first argument is the place to digg (here a simple URL)
- the second is the extraction plan (here a simple CSS selector)

At last, you may have noticed that when you ask Bob to work, he gives you back the [Promise](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Promise) that he will do his best, and nothing more (because you never know). If no problem occurs, the promise will be *resolved* with the data extracted by Bob, otherwise the promise will be *rejeced* with an error describing the problem.

Now you know Bob.

Next you'll find a complete description of how to ask Bob to mine according to your needs, because Bob can actually do much more than just mine a simple value from a single web page.

## Limitations

Bob is respecting private life and will not go digg into page which require authentication or any kind of verification: the web page must be publically available, offering its data to the world and to Bob.

## See Bob in action

If you want to see some examples of what Bob can do, check out the [Example Folder](https://github.com/raoul2000/bob-the-miner/tree/master/examples). There, you'll find commented code that actually works at the time of publishing (but may be outdated when you read it).

- *nyt-headline* : simply get the headline from the [NYT homepage](https://www.nytimes.com/)
- *npm-crawler* : result set for a search of "crawler" packages on the [NPM](https://www.npmjs.com/search?q=crawler&ranking=popularity&page=0&perPage=20) website.

To run for example *nyt-headline*, just enter :
```
npm run nyt-headline
```

## How to ask Bob to mine

To be able to mine, Bob needs 2 things :

- an **itinerary** : because the World Wide Web is a vast land, and because you don't want Bob to be lost, you must provide him with an itinerary that will be used to digg one or more pages hidden in the web.
- an **extractionPlan** : once Bob reaches the digging area (i.e. the target web page), he has to start working. To be able to extract the valuable data you are interested in, you will pass an *extraction plan* to Bob.


Bob is also willing to modify a little bit how he works if you're not satisfied with his traditional digging technique (but you'll have to ask politely). For this, you can use a third optional argument that will be described in another section.