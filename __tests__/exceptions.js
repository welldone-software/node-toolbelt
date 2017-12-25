const HttpError = require('standard-http-error')
const _ =require('lodash')
const {
    AlreadyExistsError,
    AuthorizationError,
    AuthenticationError,
    InvalidArgumentError,
    InvalidStateError,
    NotFoundError,
    UnexpectedError
} = require('../src/lib/exceptions')

const initDefaultValues=(error, httpErrorType)=>{
    expect(new error()).toEqual({
        message: httpErrorType,
        name: error.name,
        code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
        context: undefined })
}

const useMessage = (error, httpErrorType)=>{
    const msg = 'some text'
    expect(new error(msg)).toEqual({
        message: msg,
        name: error.name,
        code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
        context: undefined })
}

const useContext = (error, httpErrorType)=>{
    const ctx = {data: 'some data'}
    expect(new error(ctx)).toEqual({
        message: httpErrorType,
        name: error.name,
        code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
        context: ctx })
}

const useError = (error, httpErrorType)=>{
    const baseError = new Error('oh no!')
    baseError.a = '123'
    baseError.message = 'oh my!'
    expect(new error(baseError)).toEqual({
        message: httpErrorType,
        a: baseError.a,
        name: error.name,
        code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
        context: undefined })
}

const useManyParams = (error, httpErrorType)=>{
    const baseError = new Error('oh no!')
    baseError.a = '123'
    baseError.message = 'oh my!'
    const context = {some: 'data'}
    const msg = 'oops!'
    expect(new error(msg, baseError, context)).toEqual({
        message: msg,
        a: baseError.a,
        name: error.name,
        code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
        context: context })
    expect(new error(msg, baseError)).toEqual({
        message: msg,
        name: error.name,
        a: baseError.a,
        code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
        context: undefined })
    expect(new error(msg, context)).toEqual({
        message: msg,
        name: error.name,
        code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
        context: context })
    console.log(new error(baseError, context))
    expect(new error(baseError, context)).toEqual({
        message: httpErrorType,
        a: baseError.a,
        name: error.name,
        code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
        context: context })
}

const exceptions = [
    {exceptionType:AlreadyExistsError, httpErrorType: 'Conflict'},
    {exceptionType:AuthorizationError, httpErrorType: 'Unauthorized'},
    {exceptionType:AuthenticationError, httpErrorType: 'Unauthorized'},
    {exceptionType:InvalidArgumentError, httpErrorType: 'Bad Request'},
    {exceptionType:InvalidStateError, httpErrorType: 'Bad Request'},
    {exceptionType:NotFoundError, httpErrorType: 'Not Found'},
    {exceptionType:UnexpectedError, httpErrorType: 'Internal Server Error'},
]
for (const {exceptionType, httpErrorType} of exceptions) {
    describe(exceptionType.name, ()=>{
        test('has correct default values',()=>initDefaultValues(exceptionType, httpErrorType))
        test('use message',()=>useMessage(exceptionType, httpErrorType))
        test('use context',()=>useContext(exceptionType, httpErrorType))
        test('use base error',()=>useError(exceptionType, httpErrorType))
        test('use many ctor parameters',()=>useManyParams(exceptionType, httpErrorType))
    })
}