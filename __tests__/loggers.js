const {
  _parseBody,
  _requestSerializer,
  _removeDeep,
} = require('../src/lib/loggers')
const {IncomingMessage} = require('http')

const loggerOptions = {
  removeSensitiveFields: true,
  sensitiveFields: ['password'],
  maxBodySize: 1024,
  sensitiveHeaders: ['authorization', 'proxy-authorization'],
}

describe('remove deep', () => {
  test('return new object', () => {
    const a = {key: 'val', otherKey: {nested: 'other val'}}
    expect(_removeDeep(a, [])).not.toBe(a)
  })
  test('return same object', () => {
    const a = {
      key: 'val',
      otherKey: {nestedKey: 'other val', nestedObject: {t: 123}},
      array: [1, {a: '123'}],
    }
    const result = _removeDeep(a, [])
    expect(result).toEqual(a)
  })
  test('remove keys', () => {
    const a = {
      password: {pass: '123'},
      key: 'val',
      otherKey: {password: 'other val', nestedObject: {token: 123}},
      array: [1, {a: '123'}],
    }
    expect(_removeDeep(a, ['password', 'token'])).toEqual({
      key: 'val',
      otherKey: {password: undefined, nestedObject: {token: undefined}},
      array: [1, {a: '123'}],
      password: undefined,
    })
  })
})

describe('parseBody', () => {
  test('remove sensitive fields', () => {
    const body = {
      password: 'my secret password',
      user: 'John Doe',
      array: [{
        password: 'my secret password',
      }],
    }
    const req = {
      headers: {
        'content-type': 'application/json',
      },
      raw: {body},
    }
    const result = _parseBody(req, loggerOptions)
    expect(result).toEqual({user: 'John Doe', array: [{}]})
  })
  test('no body', () => {
    const req = {
      headers: {
        'content-type': 'application/json',
      },
      raw: {},
    }
    expect(_parseBody(req, loggerOptions)).toEqual(undefined)
  })
  test('unsupport body type', () => {
    const req = {
      headers: {
        'content-type': 'application/xml',
      },
      raw: {body: 'some body'},
    }
    expect(_parseBody(req, loggerOptions)).toEqual(undefined)
  })
  test('body too long', () => {
    const body = {
      blaBla: 'so long bla bla text',
    }
    const bodyString = JSON.stringify(body)
    const req = {
      headers: {
        'content-type': 'application/json',
        'content-length': bodyString.length.toString(),
      },
      raw: {body},
    }
    const result = _parseBody(
      req,
      Object.assign(loggerOptions, {maxBodySize: 20})
    )
    expect(result).toEqual('{"blaBla":"so lon...')
  })
})

describe('requestSerializer', () => {
  const reqRaw = new IncomingMessage()
  reqRaw.body = {a: '123'}
  const req = {
    headers: {
      'content-type': 'application/json',
      authorization: 'Barear asdihadfkldfhklsdfhbksdfbsdfkhb',
    },
    raw: reqRaw,
  }
  test('parse options', () => {
    const res = _requestSerializer(loggerOptions, req)
    expect(res.headers).toEqual({'content-type': 'application/json'})
    expect(res.headers).not.toBe(req.headers)
    expect(res.body).not.toBe(reqRaw.body)
  })
})
