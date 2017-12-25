const pino = require('pino')
const {assignWith} = require('lodash')
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

const requestSerializer = req => 
  (req && req.raw instanceof IncomingMessage) ? ({
      ...pino.stdSerializers.req(req),
      body: req.raw.body,
    }) : req

const serializers = {
  req: requestSerializer,
  err: errSerializer,
  error: errSerializer,
}

const logger = pino({serializers})
const expressLogger = expressPino({logger, serializers})

module.exports = {
  logger,
  expressLogger,
}
