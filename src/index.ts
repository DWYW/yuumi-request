import { Interceptor } from "./interceptor"
import { addQueueItem, setMaxCount } from "./queue/index"
import { QueueItmeLevel } from "./queue/item"
import { XHRCtor, XHRExtraCtor } from "./request/xhr/index"

interface StringObject { [key: string]: string }

interface YuumiRequestCtor {
  baseURI?: string;
  headers?: StringObject;
  requestMaxCount?: number;
}

export interface RequestOptions extends XHRCtor {
  level? : QueueItmeLevel
}

export interface MethodRequestOptions extends XHRExtraCtor {
  level? : QueueItmeLevel
}

export class YuumiRequest {
  public baseURI: string
  public baseHeaders: StringObject
  public interceptor: Interceptor

  constructor (config?: YuumiRequestCtor) {
    const { baseURI, headers, requestMaxCount } = Object.assign({
      baseURI: '',
      headers: {},
      requestMaxCount: {}
    }, config)

    this.baseURI = baseURI
    this.baseHeaders = headers
    this.interceptor = new Interceptor()
    setMaxCount(requestMaxCount)
  }

  request (options: RequestOptions) {
    const proxy: any = {}

    const promise = new Promise((resolve, reject) => {
      proxy.resolve = resolve
      proxy.reject = reject
    })

    options.path = `${this.baseURI || ''}${options.path}`
    options.headers = Object.assign({}, this.baseHeaders, options.headers)

    addQueueItem(Object.assign({
      interceptor: this.interceptor
    }, proxy, options))

    return promise
  }

  get (path: string, params?: { [key: string]: number|string }, options?: MethodRequestOptions): Promise<any> {
    const _params = options?.params
    const _options = Object.assign({}, options, {
      path: path,
      method: 'GET',
      params: Object.assign({}, _params, params)
    }) as RequestOptions
    return this.request.call(this, _options)
  }

  post (path: string, data?: any, options?: MethodRequestOptions): Promise<any> {
    const _options = Object.assign({}, options, {
      path: path,
      method: 'POST',
      data: data
    }) as RequestOptions
    return this.request.call(this, _options)
  }

  put (path: string, data?: any, options?: MethodRequestOptions): Promise<any> {
    const _options = Object.assign({}, options, {
      path: path,
      method: 'PUT',
      data: data
    }) as RequestOptions
    return this.request.call(this, _options)
  }

  delete (path: string, data?: any, options?: MethodRequestOptions): Promise<any> {
    const _options = Object.assign({}, options, {
      path: path,
      method: 'DELETE',
      data: data
    }) as RequestOptions
    return this.request.call(this, _options)
  }
}

export {QueueItmeLevel} from './queue/item'