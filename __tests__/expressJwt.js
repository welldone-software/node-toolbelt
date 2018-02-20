/* eslint no-undef: warn */
const {
  secureMiddlware,
} = require('../src/lib/expressJwt')

describe('secureMiddlware', () => {
  const authError = {
    message: 'jwt token not valid',
    name: 'AuthenticationError',
    code: 401,
    context: {jwt: undefined},
  }
  test('no jwt', () =>
    new Promise((resolve) => {
      const middlware = secureMiddlware()
      middlware({}, {}, (err) => {
        expect(err).toEqual(authError)
        resolve()
      })
    }))

  test('no user id', () =>
    new Promise((resolve) => {
      const middlware = secureMiddlware()
      middlware({jwt: {verified: true}}, {}, (err) => {
        expect(err).toEqual(Object.assign({}, authError, {context: {jwt: {verified: true}}}))
        resolve()
      })
    }))

  test('no verified and shouldBeVerified', () =>
    new Promise((resolve) => {
      const middlware = secureMiddlware()
      middlware({jwt: {userId: '123'}}, {}, (err) => {
        expect(err).toEqual(Object.assign({}, authError, {context: {jwt: {userId: '123'}}}))
        resolve()
      })
    }))

  test('verified shouldBeVerified', () =>
    new Promise((resolve) => {
      const middlware = secureMiddlware()
      middlware({jwt: {verified: true, userId: '123'}}, {}, (err) => {
        expect(err).toEqual(undefined)
        resolve()
      })
    }))

  test('not verified should not be verified', () =>
    new Promise((resolve) => {
      const middlware = secureMiddlware({shouldBeVerified: false})
      middlware({jwt: {userId: '123'}}, {}, (err) => {
        expect(err).toEqual(undefined)
        resolve()
      })
    }))

  test('not verified should not be verified', () =>
    new Promise((resolve) => {
      const middlware = secureMiddlware({shouldBeVerified: false})
      middlware({jwt: {userId: '123'}}, {}, (err) => {
        expect(err).toEqual(undefined)
        resolve()
      })
    }))
  test('find user', () =>
    new Promise((resolve) => {
      const findUser = ({id}) => ({dataValues: {id, name: 'Adam'}})
      const middlware = secureMiddlware({shouldBeVerified: false, findUser, shouldAddUserToRequest: true})
      const req = {jwt: {userId: '123'}}
      middlware(req, {}, () => {
        expect(req).toEqual({jwt: {userId: '123'}, userData: {id: '123', name: 'Adam'}})
        resolve()
      })
    }))
  test('user with roles', () =>
    new Promise((resolve) => {
      const findUser = () => ({roles: ['user', 'coolman']})
      const middlware = secureMiddlware({shouldBeVerified: false, findUser, roles: ['coolman']})
      const req = {jwt: {userId: '123'}}
      middlware(req, {}, () => {
        expect(req).toEqual({jwt: {userId: '123'}})
        resolve()
      })
    }))
  test('user without roles', () =>
    new Promise((resolve) => {
      const findUser = () => ({roles: ['user']})
      const middlware = secureMiddlware({shouldBeVerified: false, findUser, roles: ['coolman']})
      const req = {jwt: {userId: '123'}}
      middlware(req, {}, (err) => {
        console.warn(err)
        expect(err).toEqual({
          message: 'User not autherize to role',
          name: 'AuthorizationError',
          code: 401,
          context: {userId: '123', roles: ['coolman' ]},
        })
        resolve()
      })
    }))
})
