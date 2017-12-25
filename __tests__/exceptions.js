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
    const err = new error(msg)
    expect(err).toEqual({
        message: msg,
        name: error.name,
        code: HttpError[_.snakeCase(httpErrorType).toUpperCase()],
        context: undefined })
}

describe('AlreadyExistsError',()=>{
    test('has correct default values',()=>initDefaultValues(AlreadyExistsError, 'Conflict'))
    test('use message',()=>useMessage(AlreadyExistsError, 'Conflict'))
})

describe('AuthorizationError',()=>{
    test('has correct default values',()=>initDefaultValues(AuthorizationError, 'Unauthorized'))
    test('use message',()=>useMessage(AlreadyExistsError, 'Conflict'))
})

describe('AuthenticationError',()=>{
    test('has correct default values',()=>initDefaultValues(AuthenticationError, 'Unauthorized'))
    test('use message',()=>useMessage(AlreadyExistsError, 'Conflict'))
})

describe('InvalidArgumentError',()=>{
    test('has correct default values',()=>initDefaultValues(InvalidArgumentError, 'Bad Request'))
    test('use message',()=>useMessage(AlreadyExistsError, 'Conflict'))
})

describe('InvalidStateError',()=>{
    test('has correct default values',()=>initDefaultValues(InvalidStateError, 'Bad Request'))
    test('use message',()=>useMessage(AlreadyExistsError, 'Conflict'))
})

describe('NotFoundError',()=>{
    test('has correct default values',()=>initDefaultValues(NotFoundError, 'Not Found'))
    test('use message',()=>useMessage(AlreadyExistsError, 'Conflict'))
})

describe('UnexpectedError',()=>{
    test('has correct default values',()=>initDefaultValues(UnexpectedError, 'Internal Server Error'))
    test('use message',()=>useMessage(AlreadyExistsError, 'Conflict'))
})