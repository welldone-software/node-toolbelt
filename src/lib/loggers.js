const pino = require('pino')
const {assignWith, mapValues, map} = require('lodash')
const expressPino = require('pino-http')
const {IncomingMessage} = require('http')
const stringify = require('json-stringify-safe')

const assignWithCustomizer = (objValue, srcValue) =>
  (objValue === undefined ? srcValue : objValue)

const removeDeep = (obj, keys) => {
  const fn = obj instanceof Array ? map : mapValues
  return fn(obj, (v, k) => {
    if (keys.indexOf(k) === -1) {
      return typeof v === 'object' ? removeDeep(v, keys) : v
    }
    return undefined
  })
}

const errSerializer = (options = {}, err) => {
  let error =
    err instanceof Error
      ? assignWith(
        {
          type: err.constructor.name,
          message: err.message,
          stack: err.stack,
        },
        err,
        assignWithCustomizer
      )
      : err
  if (options.removeSensitiveFields) {
    error = JSON.parse(stringify(error)) // Remove raw values
    error = removeDeep(error, options.sensitiveFields)
  }
  return error
}

const parseBody = (req, options) => {
  const contetType = req.headers['content-type']
  const useBody =
    contetType &&
    /application\/json|application\/x-www-form-urlencoded/i.test(contetType)

  if (useBody && req.raw.body) {
    let {body} = req.raw

    if (options.removeSensitiveFields) {
      body = removeDeep(body, options.sensitiveFields)
    }

    if (req.headers['content-length'] > options.maxBodySize) {
      if (typeof body !== 'string') {
        body = stringify(body)
      }
      body = `${body.slice(0, options.maxBodySize - 3)}...`
    }
    return body
  }

  return undefined
}

const parseHeaders = (headers, opts) =>
  (opts.removeSensitiveFields
    ? removeDeep(headers, opts.sensitiveHeaders)
    : headers)

const requestSerializer = (options = {}, req) =>
  (req && req.raw instanceof IncomingMessage
    ? assignWith(
      {
        body: parseBody(req, options),
        headers: parseHeaders(req.headers, options),
      },
      req,
      assignWithCustomizer
    )
    : req)

const customLogLevel = (res, err) => {
  if (res.statusCode >= 400 && res.statusCode < 500) {
    return 'warn'
  } else if (res.statusCode >= 500 || err) {
    return 'error'
  }
  return 'info'
}

const serializers = (options = {}) => {
  const defaultOptions = {
    maxBodySize: 1024,
    removeSensitiveFields: true,
    sensitiveHeaders: ['authorization', 'proxy-authorization'],
    sensitiveFields: ['password'],
  }
  const opts = {...defaultOptions, ...options}

  return ({
    req: requestSerializer.bind(null, opts),
    err: errSerializer.bind(null, opts),
    error: errSerializer.bind(null, opts),
  })
}

const logger = pino({serializers: serializers()})
const expressLogger = options =>
  expressPino({logger, serializers: serializers(options), customLogLevel})

module.exports = {
  logger,
  expressLogger,
  _errSerializer: errSerializer,
  _parseBody: parseBody,
  _requestSerializer: requestSerializer,
  _removeDeep: removeDeep,
}
