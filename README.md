
> What ? another web scraper ? ...yeah, that's Bob !

What about [reading the doc ?](https://raoul2000.github.io/bob-the-miner/)

# Install

To use Bob in your own project :

```
npm install bob-the-miner --save
```

If you want to contribute :

```
git clone https://github.com/raoul2000/bob-the-miner.git
cd bob-the-miner
npm install
```

# Test

First start the test local server :

```
npm run server
```

Then open another shell run the tests :

```
npm test
```

# Examples

- extract titles from the [nodejs]('https://foundation.nodejs.org) new website

```
npm run nodejs-news
```

- extract headlines from the [New-York Times](https://www.nytimes.com/) website

```
npm run nyt-headline
```

- extract packages list from [NPM](https://www.npmjs.com) website

```
npm run npm-crawler
```

# Documentation

Documentation is based on [vuepress](https://vuepress.vuejs.org).

To view the documentation running a local server :

```
npm run docs:dev
```

> If the error `error:0308010C:digital envelope routines::unsupported` is reported during local dev server startup, try to first 
> define `export NODE_OPTIONS=--openssl-legacy-provider` and re-run the command. (see [this thread](https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported) for more)


To build the documentation :

```
npm run docs:build
```

Then copy the generated files from `docs/.vuepress/dist` to another (temporary) folder outside of the project, switch the the branch **gh-pages** and copy back the files. Then commit and push.
