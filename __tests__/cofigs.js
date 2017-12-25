const { mapEnv, assignEnv, deepMapEnv } = require('../src/lib/configs')

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

describe('deepMapEnv', ()=>{
  test('deep',()=>{
    const a = {b:1,c:{d:'abc',f:[1,23,{r:'q'},{m:{t:1}}]}}
    expect(deepMapEnv(a)).toEqual(a)
  })
  test('replace specefic keys', ()=>{
    const a = {a:{b:123},b:[1,2,3],someText:1,c:{textAndText:'abc',f:[1,23,{r:'q'},{m:{t:1}}]}, d:{f:{g:1},y:2}}
    process.env['SOME_TEXT'] = '123'
    process.env['C__TEXT_AND_TEXT'] = '456'
    process.env['D__F__G'] = '789'
    process.env['C__F__0'] = 'arrays'
    process.env['C__F__3__M__T'] = 'arrays&objects'
    process.env['A'] = 'replace object'
    process.env['B'] = 'replace array'
    expect(deepMapEnv(a)).toEqual({
      a:'replace object',
      b:'replace array',
      someText:'123',
      c:{textAndText:'456',f:['arrays',23,{r:'q'},{m:{t:'arrays&objects'}}]}, 
      d:{f:{g:'789'},y:2}
    })
  })
})
