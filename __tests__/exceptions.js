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

describe('AlreadyExistsError',()=>{
    test('has correct default values',()=>initDefaultValues(AlreadyExistsError, 'Conflict'))
})

describe('AuthorizationError',()=>{
    test('has correct default values',()=>initDefaultValues(AuthorizationError, 'Unauthorized'))
})

describe('AuthenticationError',()=>{
    test('has correct default values',()=>initDefaultValues(AuthenticationError, 'Unauthorized'))
})

describe('InvalidArgumentError',()=>{
    test('has correct default values',()=>initDefaultValues(InvalidArgumentError, 'Bad Request'))
})

describe('InvalidStateError',()=>{
    test('has correct default values',()=>initDefaultValues(InvalidStateError, 'Bad Request'))
})

describe('NotFoundError',()=>{
    test('has correct default values',()=>initDefaultValues(NotFoundError, 'Not Found'))
})

describe('UnexpectedError',()=>{
    test('has correct default values',()=>initDefaultValues(UnexpectedError, 'Internal Server Error'))
})