const {createApiEndpoint} = require('../src/lib/expressHelpers')

const res = {
  send: () => {},
}
const req = {
  body: {some: 'data'},
}
const next = () => {}

describe('createApiEndpoint', () => {
  test('pass body', async () => {
    const promise = new Promise((resolve) => {
      const endPoint = createApiEndpoint(resolve)
      endPoint(req, res, next)
    })

    expect(promise).resolves.toEqual(req)
  })
  test('send result', async () => {
    const promise = new Promise((resolve) => {
      const endPoint = createApiEndpoint(() => ({a: '123'}))
      endPoint(req, {send: resolve}, next)
    })

    expect(promise).resolves.toEqual({a: '123'})
  })
  test('send async result', async () => {
    const promise = new Promise((resolve) => {
      const endPoint = createApiEndpoint(async () => 'result')
      endPoint(req, {send: resolve}, next)
    })

    expect(promise).resolves.toEqual('result')
  })
  test('catch error', () =>
    new Promise((resolve) => {
      const endPoint = createApiEndpoint(() => {
        throw new Error('oh no!')
      })
      endPoint(req, res, (err) => {
        expect(err.message).toEqual('oh no!')
        resolve()
      })
    }))
})
