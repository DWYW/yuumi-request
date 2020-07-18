import { _Interceptors, _HTTPRequestCtorOptions } from '../../types/index'
import createXHR from './xhr'
let id = 0

export default class HTTPRequest {
  readonly id: number
  readonly options: _HTTPRequestCtorOptions

  public isCancel = false
  public interceptors: _Interceptors
  public resolve: (value?: any) => any
  public reject: (reason?: any) => any

  constructor (options: _HTTPRequestCtorOptions) {
    this.id = id++
    this.options = options
  }

  exec (): Promise<any> {
    const { baseURI, path, ..._options } = this.options
    const _path = `${baseURI || ''}${path}`
    const options = Object.assign({ path: _path }, _options)

    let promise: Promise<any> = Promise.resolve(options).then((options) => {
      // 如果在发送之前被取消了
      if (this.isCancel) {
        throw new Error('request:aborted')
      }

      return options
    })

    this.interceptors.requestInterceptors.forEach((item) => {
      promise = promise.then(item.resolve, item.reject)
    })

    promise = promise.then(createXHR, undefined)

    this.interceptors.responseInterceptors.forEach((item) => {
      promise = promise.then(item.resolve, item.reject)
    })

    return promise.then(this.resolve, this.reject)
  }
}
