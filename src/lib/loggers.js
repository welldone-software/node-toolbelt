const pino = require('pino')
const {assignWith, mapValues, map} = require('lodash')
const expressPino = require('express-pino-logger')
const {IncomingMessage} = require('http')

const assignWithCustomizer = (objValue, srcValue) =>
  (objValue === undefined ? srcValue : objValue)

const errSerializer = err =>
  (err instanceof Error
    ? assignWith(
      {
        type: err.constructor.name,
        message: err.message,
        stack: err.stack,
      },
      err,
      assignWithCustomizer
    )
    : err)

const removeDeep = (obj, keys) => {
  const fn = obj instanceof Array ? map : mapValues
  return fn(obj, (v, k) => {
    if (keys.indexOf(k) === -1) {
      return typeof v === 'object' ? removeDeep(v, keys) : v
    }
  })
}

const parseBody = (req, options) => {
  let body

  const contetType = req.headers['content-type']
  const useBody =
    contetType &&
    /application\/json|application\/x-www-form-urlencoded/i.test(contetType)

  if (useBody && req.raw.body) {
    body = req.raw.body

    if (options.removeSensitiveFields) {
      body = removeDeep(body, options.sensitiveFields)
    }

    if (req.headers['content-length'] > options.maxBodySize) {
      if (typeof body !== 'string') {
        body = JSON.stringify(body)
      }
      body = `${body.slice(0, options.maxBodySize - 3)}...`
    }
  }
  return body
}

const parseHeaders = (headers, opts) =>
  (opts.removeSensitiveFields
    ? removeDeep(headers, opts.sensitiveHeaders)
    : headers)

const requestSerializer = (options = {}, req) => {
  const defaultOptions = {
    maxBodySize: 1024,
    removeSensitiveFields: true,
    sensitiveHeaders: ['authorization', 'proxy-authorization'],
    sensitiveFields: ['password'],
  }
  const opts = {...defaultOptions, ...options}

  return req && req.raw instanceof IncomingMessage
    ? assignWith(
      {
        body: parseBody(req, opts),
        headers: parseHeaders(req.headers, opts),
      },
      req,
      assignWithCustomizer
    )
    : req
}

const serializers = options => ({
  req: requestSerializer.bind(null, options),
  err: errSerializer,
  error: errSerializer,
})

const logger = pino({serializers: serializers()})
const expressLogger = options =>
  expressPino({logger, serializers: serializers(options)})

module.exports = {
  logger,
  expressLogger,
  _errSerializer: errSerializer,
  _parseBody: parseBody,
  _requestSerializer: requestSerializer,
  _removeDeep: removeDeep,
}
