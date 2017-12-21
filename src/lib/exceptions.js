const HttpError = require('standard-http-error')

class BaseError extends HttpError {
  constructor(code, msgBaseErrorOrContext, baseErrorOrContext, context) {
    const msg =
      typeof msgBaseErrorOrContext === 'string'
        ? msgBaseErrorOrContext
        : undefined
    const baseError =
      msgBaseErrorOrContext instanceof Error
        ? msgBaseErrorOrContext
        : baseErrorOrContext instanceof Error ? baseErrorOrContext : undefined
    const ctx =
      context ||
      (!baseError && baseErrorOrContext) ||
      (!msg && !baseError && msgBaseErrorOrContext)
    super(code, msg, baseError)
    this.context = ctx
  }
}

module.exports.NotFoundError = class NotFoundError extends BaseError {
  constructor(msg, baseErrorOrContext, context) {
    super(HttpError.NOT_FOUND, msg, baseErrorOrContext, context)
  }
}

module.exports.AlreadyExistsError = class AlreadyExistsError extends BaseError {
  constructor(msg, baseErrorOrContext, context) {
    super(HttpError.CONFLICT, msg, baseErrorOrContext, context)
  }
}

module.exports.InvalidArgumentError = class InvalidArgumentError extends BaseError {
  constructor(msg, baseErrorOrContext, context) {
    super(HttpError.BAD_REQUEST, msg, baseErrorOrContext, context)
  }
}

module.exports.InvalidStateError = class InvalidStateError extends BaseError {
  constructor(msg, baseErrorOrContext, context) {
    super(HttpError.BAD_REQUEST, msg, baseErrorOrContext, context)
  }
}

module.exports.AuthenticationError = class AuthenticationError extends BaseError {
  constructor(msg, baseErrorOrContext, context) {
    super(HttpError.UNAUTHORIZED, msg, baseErrorOrContext, context)
  }
}

module.exports.AuthorizationError = class AuthorizationError extends BaseError {
  constructor(msg, baseErrorOrContext, context) {
    super(HttpError.UNAUTHORIZED, msg, baseErrorOrContext, context)
  }
}

module.exports.UnexpectedError = class UnexpectedError extends BaseError {
  constructor(msg, baseErrorOrContext, context) {
    super(HttpError.INTERNAL_SERVER_ERROR, msg, baseErrorOrContext, context)
  }
}
