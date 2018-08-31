
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

Test are based on [Mocha](https://mochajs.org/) which is supposed to be installed *globally* and accessible on your environment.
If you need to install Mocha :

```
npm install --global mocha
```

To check it is installed, display its version number:
```
> mocha --version
2.4.5            
```
Now you are ready to run tests. First start the test local server :
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

Documentation is based on [vuepress](https://vuepress.vuejs.org) that is assumed to be globally installed. If that's not the case, install it :

```
$ npm install --global vuepress
```

To view the documentation :

```
npm run docs:dev
```

To build the documentation :
```
npm run docs:build
```

Then copy the generated files from `docs/.vuepress/dist` to another (temporary) folder outside of the project, switch the the branch **gh-pages** and copy back the files. Then commit and push.
