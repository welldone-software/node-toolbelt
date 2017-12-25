const { assignEnv } = require('../src/lib/configs')

const newObjectTest = (fn) => {
  const a = {}
  expect(fn(a)).not.toBe(a)
  expect(fn(a) !== a).toBeTruthy()
}

const replaceKeysTest =  (fn) => {
  const a = {HELLO: 'world'}
  process.env.HELLO = 'env'
  expect(fn(a).HELLO).toEqual('env')
}

const addEnvValues =  (fn) => {
  const a = {}
  process.env.TEST = 'env'
  expect(fn(a).TEST).toEqual('env')
}

const addDotEnvValues =  (fn) => {
  const a = {}
  expect(fn(a).DOT_ENV).toEqual('.env')
}

const returnDefaultValues = (fn) =>{
  const a = {key:'val'}
  expect(fn(a).key).toEqual('val')
}

const dontAddAllEnvValues = (fn) =>{
  const a = {key:'val'}
  process.env.MORE_VALUE = 'env'
  expect(fn(a).MORE_VALUE).toEqual(undefined)
}

describe('assignEnv', () => {
  test('returns the same object', ()=>newObjectTest(assignEnv))
  test('replace keys with env keys', ()=>replaceKeysTest(assignEnv))
  test('add enviorment values', ()=>addEnvValues(assignEnv))
  test('add dotenv values', ()=>addDotEnvValues(assignEnv))
  test('return default values', ()=>returnDefaultValues(assignEnv))
  test('dont add all values from env', ()=>dontAddAllEnvValues(assignEnv))
})
