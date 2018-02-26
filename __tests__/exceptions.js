const HttpError = require('standard-http-error')
const _ = require('lodash')
const {
  AlreadyExistsError,
  AuthorizationError,
  AuthenticationError,
  InvalidArgumentError,
  InvalidStateError,
  NotFoundError,
  UnexpectedError,
} = require('../src/lib/exceptions')

const expectEqual = (error, httpErrorType, name, context, message = httpErrorType, moreKeys = {}) =>
  expect(error).toEqual(Object.assign(moreKeys, {
    message,
    name,
    code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
    context,
  }))

const initDefaultValues = (ErrorType, httpErrorType) =>
  expectEqual(new ErrorType(), httpErrorType, ErrorType.name)

const useMessage = (ErrorType, httpErrorType, msg = 'some text') =>
  expectEqual(new ErrorType(msg), httpErrorType, ErrorType.name, undefined, msg)

const useContext = (ErrorType, httpErrorType, ctx = {data: 'some data'}) =>
  expectEqual(new ErrorType(ctx), httpErrorType, ErrorType.name, ctx)

const useError = (ErrorType, httpErrorType) => {
  const baseError = new Error('oh no!')
  baseError.a = '123'
  baseError.message = 'oh my!'
  expectEqual(
    new ErrorType(baseError), httpErrorType, ErrorType.name,
    undefined, httpErrorType, {a: baseError.a}
  )
}

const useManyParams = (ErrorType, httpErrorType) => {
  const baseError = new Error('oh no!')
  baseError.a = '123'
  baseError.message = 'oh my!'
  const context = {some: 'data'}
  const msg = 'oops!'
  expectEqual(
    new ErrorType(msg, baseError, context), httpErrorType, ErrorType.name,
    context, msg, {a: baseError.a}
  )
  expectEqual(
    new ErrorType(msg, baseError), httpErrorType, ErrorType.name,
    undefined, msg, {a: baseError.a}
  )
  expectEqual(new ErrorType(msg, context), httpErrorType, ErrorType.name, context, msg)
  expectEqual(
    new ErrorType(baseError, context), httpErrorType, ErrorType.name,
    context, httpErrorType, {a: baseError.a}
  )
}

const exceptions = [
  {exceptionType: AlreadyExistsError, httpErrorType: 'Conflict'},
  {exceptionType: AuthorizationError, httpErrorType: 'Unauthorized'},
  {exceptionType: AuthenticationError, httpErrorType: 'Unauthorized'},
  {exceptionType: InvalidArgumentError, httpErrorType: 'Bad Request'},
  {exceptionType: InvalidStateError, httpErrorType: 'Bad Request'},
  {exceptionType: NotFoundError, httpErrorType: 'Not Found'},
  {exceptionType: UnexpectedError, httpErrorType: 'Internal Server Error'},
]

exceptions.forEach(({exceptionType, httpErrorType}) => {
  describe(exceptionType.name, () => {
    test('has correct default values', () =>
      initDefaultValues(exceptionType, httpErrorType))
    test('use message', () => useMessage(exceptionType, httpErrorType))
    test('use context', () => useContext(exceptionType, httpErrorType))
    test('use base error', () => useError(exceptionType, httpErrorType))
    test('use many ctor parameters', () =>
      useManyParams(exceptionType, httpErrorType))
  })
})
