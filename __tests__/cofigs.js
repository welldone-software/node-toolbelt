const {mapEnv, assignEnv} = require('../src/lib/configs')

const newObjectTest = () => {
  const a = {}
  expect(mapEnv(a)).not.toBe(a)
  expect(mapEnv(a) !== a).toBeTruthy()
}

const replaceKeysTest =  () => {
  const a = {}
  expect(assignEnv(a)).toBe(a)
  expect(assignEnv(a) === a).toBeTruthy()
}

describe('mapEnv', () => {

  test('returns a new object', newObjectTest)
  test('replace keys with env keys', replaceKeysTest)
  
})

describe('assignEnv', () => {

  test('returns the same object', newObjectTest)
  test('replace keys with env keys', replaceKeysTest)

})
