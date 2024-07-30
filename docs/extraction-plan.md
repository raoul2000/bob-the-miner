
# The Extraction Plan

> The *Extraction plan* is where you tell bob what to extract from a web page

## A Simple Selector

As we already saw, the most simple extraction plan is a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_selectors) that is evaluated on the
page. The extracted value is by default the text value of the first matching element.

```js
bob.work(
  "http://hostname/path/post-01.html",
  "div.content > div.post > h1"
);

```
In this case, the result is a simple string which is probably the title of the targeted post.

```json
"This is the Post Title"
```

If you want to extract not only the first matching element, **but all of them**, just enclose the selector in an array. The extracted value is then an array of strings.

```js
bob.work(
  "http://hostname/path/post-01.html",
  ["div.content > div.post > h1"]
);
```
Result : 
```json
["This is the Title", "Another title" ]
```


But ok, this is quite basic right ? Bob can also provide a complete object if you tell him how to
do. We will see that on the next section.

## A Complex Extraction Plan

If you want Bob to produce an object instead of a simple text value, you can give him an extraction
plan describing exactly this object. Here is an example... Are you able to understand it ?

```js
bob.work(
  "http://hostname/path/post-01.html",
  {
    "title":     "div.content > div.post > h1",
    "sub-title": "div.content > div.post > h3",
    "text" :     ["div.content > div.post > p"]
  }
);
```

The object we asked Bob to build has 3 properties. The `title` and `sub-title` of a post are simple strings. The `text` property is an array of strings, each one extracted from a paragraph of the post in this page.


The next example should be applied on a HTML page that contains several posts : 

```js
bob.work(
  "http://hostname/path/index.html",
  {
    "postList": {
      "selector": ["div.content > div.post"],
      "type": {
        "title": '.post-header > h3.title'
        "body" :  'div.excerpt'
      }
    }
  }
);
```

The object we ask Bob to build has one property named *postList*. This property is
an *array* (that's its *type*) that contains objects representings posts. Each object in this array has 2 properties.
- *title* : a string representing the title of the post
- *body* : a string representing the content of the post

Here is how the result could look like :

```json
[
  { "title" : " some title", "body" : "lorem ipsum etc ..."},
  { "title" : " some other title", "body" : "let it be etc."},
  { "title" : " the last title", "body" : "Bob is in da place !"}
]
```

> One thing to note in this example is that the CSS selector of *title* and *body* properties are **relative to the parent's selector** (in this case `div.content > div.post`). 

## Value Type

Up to now we have only been extracting the text content of the selected elements hidding somewhere in HTML page. But we can also ask Bob to extract **attributes values**. 

Yes this is possible, look : 

```js
bob.work(
  "http://hostname/path/index.html",
  {
    "some-classes": {
      "selector": ["div.content > div"],
      "type": "@class"
    }
  }
);
```

This extraction plan asks Bob to select all elements that match the `div.content > div` CSS selector, and for each one of them, read the value of the `class` attribute.

The extracted data could look like this : 

```json
["post", "post"]  
```

Ok, this is not super useful (who knows ?), but imagine that you want to extract a list of URL from anchors elements ? ... and imagine you then want to use this list of URL as an Itinerary from where to extract real data. This is exactly what the [URL extraction](./itinerary.md#url-extraction) section is all about.

Here is the example again :

```js
bob.work(
  "http://hostname/path/index.html",
  {
    selector: ["div.post a"],
    type: "@href absolute",
  }
);
```

As you can see, the `plan` property (our extraction plan) is designed to extract the **absolute URL** defined by the `href` attribute for all element that match the `div.post a` CSS selector.

The result could be something like this : 

```json
[
  "http://hostname/post1/page.html", 
  "http://hostname/post2/page.html", 
  "http://hostname/post3/page.html"
]
```

Of course, if you don't add the **absolute** modifier, Bob will just gives you what was found in the attribute value.
