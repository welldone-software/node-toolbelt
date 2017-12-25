const { mapEnv, assignEnv } = require('../src/lib/configs')

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

describe('mapEnv', () => {
  test('returns new object', ()=> {
    const a = {}
    expect(mapEnv(a)).not.toBe(a)
    expect(mapEnv(a) !== a).toBeTruthy()
  })
  test('replace default keys with env keys', ()=>replaceKeysTest(mapEnv))
  test('return default values', ()=>returnDefaultValues(mapEnv))
  test('dont add env values not from defaults', ()=>dontAddAllEnvValues(mapEnv))
})

describe('assignEnv', () => {
  test('returns the same object', ()=> {
    const a = {}
    expect(assignEnv(a)).toBe(a)
    expect(assignEnv(a) === a).toBeTruthy()
  })
  test('replace default keys with env keys', ()=>replaceKeysTest(assignEnv))
  test('return default values', ()=>returnDefaultValues(assignEnv))
  test('dont add env values not from defaults', ()=>dontAddAllEnvValues(assignEnv))
})
