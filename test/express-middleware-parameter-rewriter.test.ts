import ParameterRewriter from '../src/express-middleware-parameter-rewriter'
import * as express from 'express'
import * as http from 'http'
import fetch, { RequestInfo } from 'node-fetch'

describe('ParameterRewriter', () => {
    let app: express.Express

    app = express()
    let server: http.Server

    async function call(url: RequestInfo) {
        return new Promise((res, rej) => {
            server = app.listen(3000, '0.0.0.0', () => {
                fetch(url)
                    .then(res)
                    .catch(e => {
                        rej(e)
                    })
            })
        })
    }

    beforeEach(() => {})

    it(`should call call next middleware`, async () => {
        app.use(ParameterRewriter({}))

        const middlewareMock = jest.fn((_, __, n) => n())
        app.use(middlewareMock)

        await call('http://localhost:3000/')

        expect(middlewareMock).toBeCalledTimes(1)
    })

    it(`should call call next middleware with the original url and parameter`, async () => {
        app.use(ParameterRewriter({}))

        const middlewareMock = jest.fn((_, __, n) => n())
        app.use(middlewareMock)

        await call('http://localhost:3000/?hello=world')

        expect(middlewareMock).toBeCalledWith(
            expect.objectContaining({
                originalUrl: '/?hello=world',
                url: '/?hello=world',
                query: {
                    hello: 'world'
                }
            }),
            expect.anything(),
            expect.anything()
        )
    })

    describe(`rewrite parameter name "hello" to "nothello"`, () => {
        let middlewareMock: jest.Mock
        beforeEach(() => {
            app.use(ParameterRewriter({ hello: 'nothello' }))
            middlewareMock = jest.fn((_, __, n) => n())
            app.use(middlewareMock)
        })

        describe(`call 'http://localhost:3000/?hello=world'`, () => {
            beforeEach(async () => {
                await call('http://localhost:3000/?hello=world')
            })

            it(`should call 2nd middleware with reconfigured url`, async () => {
                expect(middlewareMock).toBeCalledWith(
                    expect.objectContaining({
                        url: '/?nothello=world'
                    }),
                    expect.anything(),
                    expect.anything()
                )
            })

            it(`should call 2nd middleware with reconfigured originalUrl`, async () => {
                expect(middlewareMock).toBeCalledWith(
                    expect.objectContaining({
                        originalUrl: '/?nothello=world'
                    }),
                    expect.anything(),
                    expect.anything()
                )
            })

            it(`should call 2nd middleware with reconfigured query`, async () => {
                expect(middlewareMock).toBeCalledWith(
                    expect.objectContaining({
                        query: {
                            nothello: 'world'
                        }
                    }),
                    expect.anything(),
                    expect.anything()
                )
            })
        })

        describe(`call 'http://localhost:3000/hello?hello=world'`, () => {
            beforeEach(async () => {
                await call('http://localhost:3000/hello?hello=world')
            })

            it(`should call 2nd middleware with reconfigured url: '/hello?nothello=world'`, async () => {
                expect(middlewareMock).toBeCalledWith(
                    expect.objectContaining({
                        url: '/hello?nothello=world'
                    }),
                    expect.anything(),
                    expect.anything()
                )
            })

            it(`should call 2nd middleware with reconfigured originalUrl: '/hello?nothello=world'`, async () => {
                expect(middlewareMock).toBeCalledWith(
                    expect.objectContaining({
                        originalUrl: '/hello?nothello=world'
                    }),
                    expect.anything(),
                    expect.anything()
                )
            })

            it(`should call 2nd middleware with reconfigured query`, async () => {
                expect(middlewareMock).toBeCalledWith(
                    expect.objectContaining({
                        query: {
                            nothello: 'world'
                        }
                    }),
                    expect.anything(),
                    expect.anything()
                )
            })
        })

        describe(`call 'http://localhost:3000/?first=param&hello=world'`, () => {
            beforeEach(async () => {
                await call('http://localhost:3000/?first=param&hello=world')
            })

            it(`should call 2nd middleware with reconfigured url: '/?first=param&nothello=world'`, async () => {
                expect(middlewareMock).toBeCalledWith(
                    expect.objectContaining({
                        url: '/?first=param&nothello=world'
                    }),
                    expect.anything(),
                    expect.anything()
                )
            })

            it(`should call 2nd middleware with reconfigured originalUrl: '/?first=param&nothello=world'`, async () => {
                expect(middlewareMock).toBeCalledWith(
                    expect.objectContaining({
                        originalUrl: '/?first=param&nothello=world'
                    }),
                    expect.anything(),
                    expect.anything()
                )
            })

            it(`should call 2nd middleware with reconfigured query`, async () => {
                expect(middlewareMock).toBeCalledWith(
                    expect.objectContaining({
                        query: expect.objectContaining({
                            first: 'param',
                            nothello: 'world'
                        })
                    }),
                    expect.anything(),
                    expect.anything()
                )
            })
        })
    })

    afterEach(() => {
        server.close()
        app.removeAllListeners()
    })
})
