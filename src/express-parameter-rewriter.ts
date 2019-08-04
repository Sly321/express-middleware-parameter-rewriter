import { NextFunction, Response, Request, RequestHandler } from 'express'

type ParameterRewriteObject = {
    [key: string]: string
}

function replaceUrlParameterName(url: string, oldName: string, newName: string): string {
    // regex mit ? oder & davor abfragen
    // dafür dynamischen regex erstellen? oder beim initialisieren der Middleware besser
    if (url.indexOf('?' + oldName) >= 0) {
        return url.replace('?' + oldName, '?' + newName)
    }
    return url.replace('&' + oldName, '&' + newName)
}

export default function ParameterRewriter(obj: ParameterRewriteObject): RequestHandler {
    const keys = Object.keys(obj)
    return (req: Request, res: Response, next: NextFunction) => {
        keys.forEach(key => {
            if (req.url.indexOf('?' + key) >= 0 || req.url.indexOf('&' + key) >= 0) {
                req.url = replaceUrlParameterName(req.url, key, obj[key])
                req.originalUrl = replaceUrlParameterName(req.originalUrl, key, obj[key])
                req.query[obj[key]] = req.query[key]
                delete req.query[key]
            }
        })
        next()
    }
}
