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
      (!msg && !baseError && msgBaseErrorOrContext) ||
      (!msg && msgBaseErrorOrContext instanceof Error && baseErrorOrContext) ||
      undefined
    super(code, msg, baseError)
    this.context = ctx
  }
}

class NotFoundError extends BaseError {
  constructor(msg, baseErrorOrContext, context) {
    super(HttpError.NOT_FOUND, msg, baseErrorOrContext, context)
  }
}

class AlreadyExistsError extends BaseError {
  constructor(msg, baseErrorOrContext, context) {
    super(HttpError.CONFLICT, msg, baseErrorOrContext, context)
  }
}

class InvalidArgumentError extends BaseError {
  constructor(msg, baseErrorOrContext, context) {
    super(HttpError.BAD_REQUEST, msg, baseErrorOrContext, context)
  }
}

class InvalidStateError extends BaseError {
  constructor(msg, baseErrorOrContext, context) {
    super(HttpError.BAD_REQUEST, msg, baseErrorOrContext, context)
  }
}

class AuthenticationError extends BaseError {
  constructor(msg, baseErrorOrContext, context) {
    super(HttpError.UNAUTHORIZED, msg, baseErrorOrContext, context)
  }
}

class AuthorizationError extends BaseError {
  constructor(msg, baseErrorOrContext, context) {
    super(HttpError.UNAUTHORIZED, msg, baseErrorOrContext, context)
  }
}

class UnexpectedError extends BaseError {
  constructor(msg, baseErrorOrContext, context) {
    super(HttpError.INTERNAL_SERVER_ERROR, msg, baseErrorOrContext, context)
  }
}

module.exports = {
  NotFoundError,
  AlreadyExistsError,
  InvalidArgumentError,
  InvalidStateError,
  AuthenticationError,
  AuthorizationError,
  UnexpectedError,
  BaseError,
}
