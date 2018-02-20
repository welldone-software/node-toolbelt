/* eslint no-undef: warn */
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

const initDefaultValues = (ErrorType, httpErrorType) => {
  expect(new ErrorType()).toEqual({
    message: httpErrorType,
    name: ErrorType.name,
    code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
    context: undefined,
  })
}

const useMessage = (ErrorType, httpErrorType) => {
  const msg = 'some text'
  expect(new ErrorType(msg)).toEqual({
    message: msg,
    name: ErrorType.name,
    code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
    context: undefined,
  })
}

const useContext = (ErrorType, httpErrorType) => {
  const ctx = {data: 'some data'}
  expect(new ErrorType(ctx)).toEqual({
    message: httpErrorType,
    name: ErrorType.name,
    code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
    context: ctx,
  })
}

const useError = (ErrorType, httpErrorType) => {
  const baseError = new Error('oh no!')
  baseError.a = '123'
  baseError.message = 'oh my!'
  expect(new ErrorType(baseError)).toEqual({
    message: httpErrorType,
    a: baseError.a,
    name: ErrorType.name,
    code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
    context: undefined,
  })
}

const useManyParams = (ErrorType, httpErrorType) => {
  const baseError = new Error('oh no!')
  baseError.a = '123'
  baseError.message = 'oh my!'
  const context = {some: 'data'}
  const msg = 'oops!'
  expect(new ErrorType(msg, baseError, context)).toEqual({
    message: msg,
    a: baseError.a,
    name: ErrorType.name,
    code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
    context,
  })
  expect(new ErrorType(msg, baseError)).toEqual({
    message: msg,
    name: ErrorType.name,
    a: baseError.a,
    code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
    context: undefined,
  })
  expect(new ErrorType(msg, context)).toEqual({
    message: msg,
    name: ErrorType.name,
    code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
    context,
  })
  expect(new ErrorType(baseError, context)).toEqual({
    message: httpErrorType,
    a: baseError.a,
    name: ErrorType.name,
    code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
    context,
  })
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
