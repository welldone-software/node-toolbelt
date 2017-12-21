const pino = require('pino')
const {assignWith} = require('lodash')
const expressPino = require('express-pino-logger')

const assignWithCustomizer = (objValue, srcValue) =>
    (objValue === undefined ? srcValue : objValue)

const errSerializer = err =>
    assignWith(
        {
          type: err.constructor.name,
          message: err.message,
          stack: err.stack,
        },
        err,
        assignWithCustomizer
    )

const logger = pino({
  serializers: {
    err: errorSerializer,
    error: errorSerializer,
  },
})

const expressLogger = expressPino({
  logger,
  // serializers: {
  //   err: errorSerializer,
  //   error: errorSerializer,
  // },
})

module.exports = {
  logger,
  expressLogger,
}
