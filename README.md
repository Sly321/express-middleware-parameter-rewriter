# express-parameter-rewriter

An express middlware that allows you to reconfigure the request parameter.

## Usage

With yarn:

```bash
yarn add express-parameter-rewriter
```

or npm:

```bash
npm i express-parameter-rewriter --save
```

Implementation:

```typescript
import * as express from 'express'

// import
import parameterRewriter from 'express-parameter-rewriter'

const app = express()
app.use(parameterRewriter({ hello: 'bye' })) // usage

app.use((req, res, next) => {
    console.log(req.url)
    console.log(req.originalUrl)
    console.log(req.query)
    next()
})

app.listen(3000, '0.0.0.0', () => {
    console.log('Listening on localhost:3000')
})
```

If you call `http://localhost:3000/?hello=world` (Tools like Insomnia, [VSCode Extension Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) or any other restclient will do the job), the app will log:

```bash
/?bye=world
/?bye=world
{ bye: "world" }
```

---

#### old doc

---

-   **Docs automatic generation and deployment** to `gh-pages`, using **[TypeDoc](http://typedoc.org/)**
-   Automatic types `(*.d.ts)` file generation
-   **[Travis](https://travis-ci.org)** integration and **[Coveralls](https://coveralls.io/)** report
-   (Optional) **Automatic releases and changelog**, using [Semantic release](https://github.com/semantic-release/semantic-release), [Commitizen](https://github.com/commitizen/cz-cli), [Conventional changelog](https://github.com/conventional-changelog/conventional-changelog) and [Husky](https://github.com/typicode/husky) (for the git hooks)

### NPM scripts

-   `npm t`: Run test suite
-   `npm start`: Run `npm run build` in watch mode
-   `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
-   `npm run test:prod`: Run linting and generate coverage
-   `npm run build`: Generate bundles and typings, create docs
-   `npm run lint`: Lints code
-   `npm run commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)

### Excluding peerDependencies

On library development, one might want to set some peer dependencies, and thus remove those from the final bundle. You can see in [Rollup docs](https://rollupjs.org/#peer-dependencies) how to do that.

Good news: the setup is here for you, you must only include the dependency name in `external` property within `rollup.config.js`. For example, if you want to exclude `lodash`, just write there `external: ['lodash']`.

### Automatic releases

_**Prerequisites**: you need to create/login accounts and add your project to:_

-   [npm](https://www.npmjs.com/)
-   [Travis CI](https://travis-ci.org)
-   [Coveralls](https://coveralls.io)

_**Prerequisite for Windows**: Semantic-release uses
**[node-gyp](https://github.com/nodejs/node-gyp)** so you will need to
install
[Microsoft's windows-build-tools](https://github.com/felixrieseberg/windows-build-tools)
using this command:_

```bash
npm install --global --production windows-build-tools
```

#### Setup steps

Follow the console instructions to install semantic release and run it (answer NO to "Do you want a `.travis.yml` file with semantic-release setup?").

_Note: make sure you've setup `repository.url` in your `package.json` file_

```bash
npm install -g semantic-release-cli
semantic-release-cli setup
# IMPORTANT!! Answer NO to "Do you want a `.travis.yml` file with semantic-release setup?" question. It is already prepared for you :P
```

From now on, you'll need to use `npm run commit`, which is a convenient way to create conventional commits.

Automatic releases are possible thanks to [semantic release](https://github.com/semantic-release/semantic-release), which publishes your code automatically on [github](https://github.com/) and [npm](https://www.npmjs.com/), plus generates automatically a changelog. This setup is highly influenced by [Kent C. Dodds course on egghead.io](https://egghead.io/courses/how-to-write-an-open-source-javascript-library)

### Git Hooks

There is already set a `precommit` hook for formatting your code with Prettier :nail_care:

By default, there are two disabled git hooks. They're set up when you run the `npm run semantic-release-prepare` script. They make sure:

-   You follow a [conventional commit message](https://github.com/conventional-changelog/conventional-changelog)
-   Your build is not going to fail in [Travis](https://travis-ci.org) (or your CI server), since it's runned locally before `git push`

This makes more sense in combination with [automatic releases](#automatic-releases)

### FAQ

#### `Array.prototype.from`, `Promise`, `Map`... is undefined?

TypeScript or Babel only provides down-emits on syntactical features (`class`, `let`, `async/await`...), but not on functional features (`Array.prototype.find`, `Set`, `Promise`...), . For that, you need Polyfills, such as [`core-js`](https://github.com/zloirock/core-js) or [`babel-polyfill`](https://babeljs.io/docs/usage/polyfill/) (which extends `core-js`).

For a library, `core-js` plays very nicely, since you can import just the polyfills you need:

```javascript
import "core-js/fn/array/find"
import "core-js/fn/string/includes"
import "core-js/fn/promise"
...
```

#### What if I don't want git-hooks, automatic releases or semantic-release?

Then you may want to:

-   Remove `commitmsg`, `postinstall` scripts from `package.json`. That will not use those git hooks to make sure you make a conventional commit
-   Remove `npm run semantic-release` from `.travis.yml`

#### What if I don't want to use coveralls or report my coverage?

Remove `npm run report-coverage` from `.travis.yml`
