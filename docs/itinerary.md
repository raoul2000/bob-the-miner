

# The Itinerary

> The *Itinerary* is when you tell bob where to go to start data extraction

## One Page

In its simplest form, the *itinerary* is the address of the page you want to mine.

```js
bob.work( "http://hostname/path/index.html", extractionPlan);
```

## Many Pages

If you want to use the same extraction plan on several pages just provide an array of adresses as the first argument.

```js
bob.work(
  [
    "http://hostname/path/index.html",
    "http://hostname/path/product.html"
  ],
  extractionPlan
);
```

In this case the result is an array where each item is the result of data extraction on one adress.  :

```json
[ result, result, ... ]
```

Due to the fact that mining job are executed in parallel, **there is no garantee that the results ordrer matches** the adresses order. If you need to maintain the adress/result relation, you can use the `indexByUrl` or `appendUrlAsProperty` options. See the [Options](./options.md) section for more.

## URL extraction

> spoiler alert ! 
> This section talks about what an extraction plan is. Please refere to [this chapter](./extraction-plan.md) is you want 
> to know everything about this subject.

There may be some cases where the addresses of the page you want Bob to mine, are themselves hidden in another page. The typical example is a list of articles displayed in a page (called the *index* page). For each article in the index page, there is a link to the article page, where the full article can be read. Now, if you are interested in all these articles in their complete version, you have to option:
- manually open the index page and retrieve addresses of all articles, then pass them to Bob as an array 
- ask Bob to do the job for you !

If you provide an extraction plan as the itinerary, Bob will assume that the extracted data **are all addresses to mine** ... and he will do so.

Let's see that on an example:
```js
        bob.work(
            {
                url: "http://hostname/blog/index.html",
                plan: {
                    selector: ["div.post a"],
                    type: "@href absolute",
                },
            },
            "h1"
        )
```
Here we ask bob to open the page a `http://hostname/blog/index.html` and extract all addresses according to the *extraction plan* provided. Then, Bob must open each pages for each one of these addresses and mine the title of the article (enclosed by the `h1` element).
The way to define an *extraction plan* is explained in [this chapter](./extraction-plan.md) but if you know a little about CSS selectors syntax
you may have alrerady understood how is works.
