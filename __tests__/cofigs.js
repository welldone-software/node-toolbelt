const {mapEnv, assignEnv} = require('../src/lib/configs')

describe('mapEnv', () => {
  test('returns a new object', () => {
    const a = {}
    expect(mapEnv(a)).not.toBe(a)
    expect(mapEnv(a) !== a).toBeTruthy()
  })
  test('replace keys with env keys', ()=>{
    process.env.TEST = 'hello env'
    const res = mapEnv({TEST:'hello world'})
    expect(res.TEST === 'hello env').toBeTruthy()
  })
})

describe('assignEnv', () => {
  test('returns the same object', () => {
      const a = {}
      expect(assignEnv(a)).toBe(a)
      expect(assignEnv(a) === a).toBeTruthy()
  })

})
