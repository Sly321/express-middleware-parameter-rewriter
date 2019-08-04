# express-parameter-rewriter

[![Build Status](https://travis-ci.org/Sly321/express-parameter-rewriter.svg?branch=master)](https://travis-ci.org/Sly321/express-parameter-rewriter)

Middleware that allows you to reconfigure the request parameter.

## Usage

With yarn:

```bash
yarn add express-parameter-rewriter
```

or npm:

```bash
npm i express-parameter-rewriter --save
```

### Example

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
