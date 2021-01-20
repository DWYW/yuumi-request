import { YuumiRequest, QueueItmeLevel } from '../../src/index'
import { queue, maxCount } from '../../src/queue'
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
    expect(_yuumi.baseHeaders).toBe(headers)
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

  it('一个请求状态完成后从队列中移除', async () => {
    const yuumi = new YuumiRequest({
      requestMaxCount: 3
    })
    const promise = yuumi.post('/get', { id: 1 })
    mockXHR.response()
    expect(queue.waiting.NORMAL.length).toBe(1)
    await promise
    expect(queue.waiting.NORMAL.length).toBe(0)
  })

  it('cancelToken', async () => {
    const yuumi = new YuumiRequest({
      requestMaxCount: 3
    })
    let cancelToken: any = null

    const promise = yuumi.post('/get', { id: 1 }, {
      cancelToken: (cancel) => {
        cancelToken = cancel
      }
    })
    expect(queue.waiting.NORMAL.length).toBe(1)
    cancelToken()
    try {
      await promise
    } catch (error) {}
    expect(queue.waiting.NORMAL.length).toBe(0)
  })

  it('设置最大请求并发', async () => {
    const yuumi = new YuumiRequest({
      requestMaxCount: 3
    })
    yuumi.get('/get', { id: 1 }, { level: QueueItmeLevel.LOW })
    yuumi.get('/get', { id: 2 })
    yuumi.get('/get', { id: 3 })
    yuumi.get('/get', { id: 4 }, { level: QueueItmeLevel.HIGH })

    expect(maxCount).toBe(3)
    await delay(0)
    expect(queue.waiting.NORMAL.length).toBe(0)
    expect(queue.waiting.LOW.length).toBe(1)
    expect(queue.running.length).toBe(3)
    await delay(500)
  })
})
