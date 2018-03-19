const HttpError = require('standard-http-error')
const {escapeRegExp} = require('lodash')
const parseUrl = require('url-parse')
const deviceDetector = require('device-detector')

const stackFileRegex = new RegExp(`${escapeRegExp(process.cwd())}`, 'ig')

const createApiEndpoint = fn => (req, res, next) => {
  Promise.resolve()
    .then(() => fn(req))
    .then(result => res.send(result))
    .catch(error => next(error))
}

const createMiddleware = fn => (req, res, next) => {
  Promise.resolve()
    .then(() => fn(req))
    .then(() => next())
    .catch(error => next(error))
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status =
    err.httpErrorCode ||
    err.status ||
    (err instanceof HttpError && err.code) ||
    500
  res.status(status).send({
    message: err.message,
    stack:
      process.env.NODE_ENV === 'production'
        ? undefined
        : (err.stack || '').replace(stackFileRegex, ''),
  })
  res.emit('error', err) // pino.js handle error log in this way
}

const getBaseUrl = req =>
  req.headers.origin ||
  (req.headers.referer ? parseUrl(req.headers.referer).origin : null)

const getRequestInfo = (req) => {
  const {headers, connection: {remoteAddress}} = req
  const ip = headers['x-forwarded-for'] || remoteAddress
  const browser = headers['user-agent']
  const device = deviceDetector.parse(browser)
  return {ip, device, browser, headers}
}

module.exports = {
  createApiEndpoint,
  createMiddleware,
  errorHandler,
  getBaseUrl,
  getRequestInfo,
}
