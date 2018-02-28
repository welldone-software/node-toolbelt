const {randomBytes} = require('crypto')
const {jwtSecure, generateToken, jwtRequest, verify} = require('../src/lib/jwt')

const secret = randomBytes(16).toString()

describe('generate and verify', () => {
  const payload = {id: '123', name: '456'}
  test('base test', () => {
    const token = generateToken(secret, payload, 1)
    const res = verify(token, secret)
    delete res.iat
    delete res.exp
    expect(res).toEqual(payload)
  })

  test('failed on wrong secret', () => {
    const token = generateToken(secret, payload, 1)
    const failedCall = verify.bind(null, token, randomBytes(16).toString())
    expect(failedCall).toThrowError('invalid signature')
  })
  test('failed on expired', async () => {
    const token = generateToken(secret, payload, 1)
    const failedCall = verify.bind(null, token, secret)
    await new Promise(resolve => setTimeout(resolve, 2000))
    expect(failedCall).toThrowError('jwt expired')
  })
})

describe('jwtRequest', () => {
  test('base test', () => {
    const payload = {id: '123', values: {name: 'adam'}}
    const token = generateToken(secret, payload, 1)
    return new Promise((resolve) => {
      const req = {headers: {authorization: `Bearer ${token}`}}
      jwtRequest(secret)(req, {}, () => {
        delete req.jwt.iat
        delete req.jwt.exp
        expect(req.jwt).toEqual(payload)
        resolve()
      })
    })
  })
})

describe('jwtSecure', () => {
  const authError = {
    message: 'jwt token not valid',
    name: 'AuthenticationError',
    code: 401,
    context: {jwt: undefined},
  }
  test('no jwt', () =>
    new Promise((resolve) => {
      const middlware = jwtSecure()
      middlware({}, {}, (err) => {
        expect(err).toEqual(authError)
        resolve()
      })
    }))

  test('no user id', () =>
    new Promise((resolve) => {
      const middlware = jwtSecure()
      middlware({jwt: {verified: true}}, {}, (err) => {
        expect(err).toEqual(Object.assign({}, authError, {context: {jwt: {verified: true}}}))
        resolve()
      })
    }))

  test('no verified and shouldBeVerified', () =>
    new Promise((resolve) => {
      const middlware = jwtSecure()
      middlware({jwt: {userId: '123'}}, {}, (err) => {
        expect(err).toEqual(Object.assign({}, authError, {context: {jwt: {userId: '123'}}}))
        resolve()
      })
    }))

  test('verified shouldBeVerified', () =>
    new Promise((resolve) => {
      const middlware = jwtSecure()
      middlware({jwt: {verified: true, userId: '123'}}, {}, (err) => {
        expect(err).toBeUndefined()
        resolve()
      })
    }))

  test('not verified should not be verified', () =>
    new Promise((resolve) => {
      const middlware = jwtSecure({shouldBeVerified: false})
      middlware({jwt: {userId: '123'}}, {}, (err) => {
        expect(err).toBeUndefined()
        resolve()
      })
    }))

  test('find user', () =>
    new Promise((resolve) => {
      const findUser = ({id}) => ({dataValues: {id, name: 'Adam'}})
      const middlware = jwtSecure({shouldBeVerified: false, findUser, shouldAddUserToRequest: true})
      const req = {jwt: {userId: '123'}}
      middlware(req, {}, () => {
        expect(req).toEqual({jwt: {userId: '123'}, userData: {id: '123', name: 'Adam'}})
        resolve()
      })
    }))
  test('user with roles', () =>
    new Promise((resolve) => {
      const findUser = () => ({roles: ['user', 'coolman']})
      const middlware = jwtSecure({shouldBeVerified: false, findUser, roles: ['coolman']})
      const req = {jwt: {userId: '123'}}
      middlware(req, {}, () => {
        expect(req).toEqual({jwt: {userId: '123'}})
        resolve()
      })
    }))
  test('user without roles', () =>
    new Promise((resolve) => {
      const findUser = () => ({roles: ['user']})
      const middlware = jwtSecure({shouldBeVerified: false, findUser, roles: ['coolman']})
      const req = {jwt: {userId: '123'}}
      middlware(req, {}, (err) => {
        expect(err).toEqual({
          message: 'User not autherize to role',
          name: 'AuthorizationError',
          code: 401,
          context: {userId: '123', roles: ['coolman']},
        })
        resolve()
      })
    }))
})
