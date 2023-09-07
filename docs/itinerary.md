

# The Itinerary

> The *Itinerary* is when you tell bob where to go to start data extraction

## a Single Page

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

Due to the fact that mining job are executed in parallel, **there is no garantee that the results ordrer matches** the adresses order. If you need to maintain the adress/result relation, you can use the `indexByUrl` or `appendUrlAsProperty` options. See the [Options](./options.md) section.

## URL extraction

TBD

There may be some cases where you don't really know the complete itinerary before to start: you only know the first step and the way to find the direction to the next one. This is for example the case if you want to work on a paginated result set.

