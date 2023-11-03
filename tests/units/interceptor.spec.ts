import {YuumiRequest} from '../../src/index'

describe('yuumi-request interceptor', () => {
  it ('设置 request interceptor', () => {
    const yuumiRequest = new YuumiRequest()

    yuumiRequest.interceptor.request((value) => value)
    expect(yuumiRequest.interceptor.requestInterceptors.length).toBe(1)

    yuumiRequest.interceptor.request((value) => value, (reason) => reason)
    expect(yuumiRequest.interceptor.requestInterceptors.length).toBe(2)

    yuumiRequest.interceptor.requestInterceptors.forEach((item) => {
      expect(item).toHaveProperty('0')
      expect(item).toHaveProperty('1')
    })
  })

  it ('设置 request interceptor', () => {
    const yuumiRequest = new YuumiRequest()

    yuumiRequest.interceptor.response((value) => value)
    expect(yuumiRequest.interceptor.responseInterceptors.length).toBe(1)

    yuumiRequest.interceptor.response((value) => value, (reason) => reason)
    expect(yuumiRequest.interceptor.responseInterceptors.length).toBe(2)

    yuumiRequest.interceptor.responseInterceptors.forEach((item) => {
      expect(item).toHaveProperty('0')
      expect(item).toHaveProperty('1')
    })
  })
})