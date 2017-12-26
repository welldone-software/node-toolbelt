const {createApiEndpoint} = require('../src/lib/expressHelpers')

const res = {
    send: ()=>{}
}
const req = {
    body:{some:'data'}
}
const next = ()=>{}

describe('createApiEndpoint', () => {
    test('pass body', async ()=>{
        const promise = new Promise ((resolve, reject)=> {
            const endPoint = createApiEndpoint(resolve)
            endPoint(req, res, next)
        })
        const _req = await promise
        expect(_req).toBe(req)
        return 
    })
    test('send result', async ()=>{
        const promise = new Promise ((resolve, reject)=> {
            const endPoint = createApiEndpoint(()=>{
                return {a:'123'}
            })
            endPoint(req, {send:resolve}, next)
        })
        const result = await promise
        expect(result).toEqual({a:'123'})
        return 
    })
    test('send async result', async ()=>{
        const promise = new Promise ((resolve, reject)=> {
            const endPoint = createApiEndpoint(async ()=>{
                return 'result'
            })
            endPoint(req, {send:resolve}, next)
        })
        const result = await promise
        expect(result).toEqual('result')
        return 
    })
    test('catch error', async ()=>{
        const promise = new Promise ((resolve, reject)=> {
            const endPoint = createApiEndpoint(()=>{
                throw new Error('oh no!')
            })
            endPoint(req, res, resolve)
        })
        const err = await promise
        expect(err instanceof Error).toBeTruthy()
        expect(err.message).toEqual('oh no!')
        return 
    })
})