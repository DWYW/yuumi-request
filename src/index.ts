import { _object, _YuumiRequestCtorOptions, _YuumiRequestOptions, _XMLHttpRequestCtorOptions } from '../types/index'
import Interceptors from './core/interceptors'
import Queue from './core/queue'
import HTTPRequest from './core/request'

export default class YuumiRequest {
  private defaults = {
    baseURI: '',
    headers: {
      'Content-Type': 'application/json'
    } as _object<string>
  }

  public queue: Queue
  public interceptors = new Interceptors()

  constructor (options: _YuumiRequestCtorOptions = {}) {
    const { baseURI, headers, maximum } = options || {}

    this.defaults.baseURI = baseURI
    this.defaults.headers = headers

    this.queue = new Queue({ maximum })
  }

  request (options: _XMLHttpRequestCtorOptions): Promise<any> {
    const _headers = Object.assign({}, this.defaults.headers, options.headers)
    const _options = Object.assign({
      path: '',
      async: true,
      level: 'normal',
      method: 'GET'
    }, options, {
      baseURI: this.defaults.baseURI,
      headers: _headers
    })
    const request = new HTTPRequest(_options)
    request.interceptors = this.interceptors
    return this.queue.addItem(request)
  }

  get (path: string, params: _object<any>, options: _YuumiRequestOptions): Promise<any> {
    const { params: _params, ..._options } = options
    const requestParams = Object.assign({}, _params, params)
    const requestOptions = Object.assign({
      path: path,
      method: 'GET',
      params: requestParams
    }, _options) as _XMLHttpRequestCtorOptions
    return this.request(requestOptions)
  }

  post (path: string, data: _object<any>, options: _YuumiRequestOptions): Promise<any> {
    const { data: _data, ..._options } = options
    const requestData = Object.assign({}, _data, data)
    const requestOptions = Object.assign({
      path: path,
      method: 'POST',
      params: requestData
    }, _options) as _XMLHttpRequestCtorOptions
    return this.request(requestOptions)
  }

  put (path: string, data: _object<any>, options: _YuumiRequestOptions): Promise<any> {
    const { data: _data, ..._options } = options
    const requestData = Object.assign({}, _data, data)
    const requestOptions = Object.assign({
      path: path,
      method: 'PUT',
      params: requestData
    }, _options) as _XMLHttpRequestCtorOptions
    return this.request(requestOptions)
  }

  delete (path: string, data: _object<any>, options: _YuumiRequestOptions): Promise<any> {
    const { data: _data, ..._options } = options
    const requestData = Object.assign({}, _data, data)
    const requestOptions = Object.assign({
      path: path,
      method: 'DELETE',
      params: requestData
    }, _options) as _XMLHttpRequestCtorOptions
    return this.request(requestOptions)
  }
}
