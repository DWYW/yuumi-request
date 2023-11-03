import { YuumiRequest } from '../../src/index'
import { MockXHR } from '../utils/createXHR'
import { delay } from '../utils/helper'

let oldXMLHttpRequest: any
let mockXHR: any

beforeAll(() => {
  oldXMLHttpRequest = (window as any).XMLHttpRequest
  mockXHR = new MockXHR()
})

afterAll(() => {
  (window as any).XMLHttpRequest = oldXMLHttpRequest
})

describe('yuumi-request', () => {
  it('设置 baseURI', () => {
    const baseURI = 'http://www.xxx.com'
    const _yuumi = new YuumiRequest({
      baseURI: baseURI
    })
    expect(_yuumi.baseURI).toBe(baseURI)
  })

  it('设置 headers', () => {
    const headers = {
      'Content-Type': 'application/json'
    }
    const _yuumi = new YuumiRequest({
      headers: headers
    })
    expect(_yuumi.headers).toBe(headers)
  })

  it('request 返回 Promise', async () => {
    const promise = new YuumiRequest().request({
      path: '/get',
      method: 'GET'
    })
    expect(promise).toBeInstanceOf(Promise)
    mockXHR.response({})
    const res: any = await promise
    expect(res.status).toBe(200)
  })

  it('get 返回 Promise', async () => {
    const promise = new YuumiRequest().get('')
    expect(promise).toBeInstanceOf(Promise)
    mockXHR.response()
    const res: any = await promise
    expect(res.status).toBe(200)
  })

  it('post 返回 Promise', async () => {
    const promise = new YuumiRequest().post('')
    expect(promise).toBeInstanceOf(Promise)
    mockXHR.response()
    const res: any = await promise
    expect(res.status).toBe(200)
  })

  it('put 返回 Promise', async () => {
    const promise = new YuumiRequest().put('')
    expect(promise).toBeInstanceOf(Promise)
    mockXHR.response()
    const res: any = await promise
    expect(res.status).toBe(200)
  })

  it('delete 返回 Promise', async () => {
    const promise = new YuumiRequest().delete('')
    expect(promise).toBeInstanceOf(Promise)
    mockXHR.response()
    const res: any = await promise
    expect(res.status).toBe(200)
  })
})
