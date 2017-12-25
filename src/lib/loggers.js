const pino = require('pino')
const {assignWith, forEach, cloneDeep} = require('lodash')
const expressPino = require('express-pino-logger')
const { IncomingMessage, ServerResponse } = require('http')

const assignWithCustomizer = (objValue, srcValue) =>
    (objValue === undefined ? srcValue : objValue)

const errSerializer = err => 
  err instanceof Error ?
    assignWith(
        {
          type: err.constructor.name,
          message: err.message,
          stack: err.stack,
        },
        err,
        assignWithCustomizer
    ) : err

const removeDeep = (obj, key) => {
  delete obj[key]
  forEach(obj, (v) => {
      return typeof v == "object" ? removeDeep(v, key) : []
  })
}

const parseBody = (req, options) =>{
  let body
  const useBody = req.headers['content-type'].split(';').some(type => {
    switch (type.trim()){
      case 'application/json': case 'application/x-www-form-urlencoded':
        return true
      default:
        return false
    }
  })
  if (useBody) {
    body = req.raw.body
    
    if (options.removeSensitiveFields)
      options.sensitiveFields.forEach(field=> removeDeep(req.raw.body, field))

    if (req.headers['content-length'] > options.maxBodySize) {
      if (typeof body !== 'string'){
        body = JSON.stringify(body)
      }
      body = `${body.slice(0, options.maxBodySize - 3)}...`
    }
  }
  return body
}

const requestSerializer = (options= {}, req) => {
  const reqClone = cloneDeep(req)
  const defaultOptions = {
    maxBodySize: 1024, 
    removeSensitiveFields: true, 
    sensitiveHeaders: ['authorization','proxy-authorization '], 
    sensitiveFields: ['password']
  }
  const opts = {...defaultOptions, ...options}

  if (opts.removeSensitiveFields)
    opts.sensitiveHeaders.forEach(header=> delete reqClone.headers[header])

  return (reqClone && reqClone.raw instanceof IncomingMessage) ? 
    assignWith(
      {
        body: parseBody(reqClone, opts),
      },
      reqClone,
      assignWithCustomizer
    ) : req
}

const serializers = (options)=> ({
  req: requestSerializer.bind(null, options),
  err: errSerializer,
  error: errSerializer,
})

const logger = pino({serializers:serializers()})
const expressLogger = (options)=> expressPino({logger, serializers:serializers(options)})

module.exports = {
  logger,
  expressLogger,
}
