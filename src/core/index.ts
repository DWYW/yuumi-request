import { Queue } from "./queue/queue"
import { Job, ResolveFun, RejectFun } from "./queue/job"
import { RequestMethod } from "./request/type"
import { XHR, XHR_RequestOption } from "./request/xhr"
import { paramStringify } from "./utils"

export interface YuumiRequestInterface {
  baseURI: string
  headers: Record<string, string>
  concurrency: number
  timeout: number
}

export type YuumiRequestCtorOption = {
  [K in keyof YuumiRequestInterface]?: YuumiRequestInterface[K] extends Function ? never : YuumiRequestInterface[K]
} & {
  paramStringify?: (value: any) => string
  xhr?: <T>(option: XHR_RequestOption) => Promise<T>
}

export type RequestOption = {
  path: string
  method: RequestMethod
  async?: boolean
  headers?: Record<string, string>
  params?: Record<string, string|number>
  data?: Record<string, any>
  cancelToken?: (cancel?: () => void) => void
  timeout?: number
  enforce?: "pre"|"normal"
  uploader?: { [key: string]: EventListener }
}

export type MethodRequestOptions = {
  [K in keyof RequestOption as Exclude<K, "path"|"method">]: RequestOption[K];
}

export class YuumiRequestInterceptor {
  public requestInterceptors: [ResolveFun, RejectFun?][] = []
  public responseInterceptors: [ResolveFun, RejectFun?][] = []

  constructor() {}

  request(resolve:ResolveFun, reject?: RejectFun) {
    this.requestInterceptors.push([resolve, reject])
  }

  response(resolve:ResolveFun, reject?: RejectFun) {
    this.responseInterceptors.push([resolve, reject])
  }
}

export class YuumiRequest implements YuumiRequestInterface {
  readonly baseURI!: string
  readonly headers!: Record<string, string>
  readonly concurrency!: number
  readonly timeout!: number
  readonly paramStringify?: (value: any) => string
  readonly xhr!: <T>(option: XHR_RequestOption) => Promise<T>
  // 拦截器
  readonly interceptor: YuumiRequestInterceptor = new YuumiRequestInterceptor()
  // 请求队列
  readonly queue!: Queue

  constructor(option?: YuumiRequestCtorOption) {
    const _option = Object.assign({
      baseURI: "",
      headers: {},
      concurrency: 4,
      timeout: 0,
      xhr: (config: XHR_RequestOption) => new XHR(config).exec()
    }, option)

    this.baseURI = _option.baseURI
    this.headers = _option.headers
    this.concurrency = _option.concurrency
    this.timeout = _option.timeout
    this.paramStringify = _option.paramStringify
    this.xhr = _option.xhr
    this.queue = new Queue([], { concurrency: this.concurrency, autoStart: true })
  }

  public request<T>(option: RequestOption): Promise<T> {
    let _url = `${this.baseURI}${option.path}`
    const query = this.paramStringify ? this.paramStringify(option.params) : paramStringify(option.params)

    if (query) {
      _url = /\?/.test(_url) ? `${_url}&${query}` : `${_url}?${query}`
    }

    const config: XHR_RequestOption = {
      url: _url,
      method: option.method,
      async: option.async,
      headers: Object.assign({}, this.headers, option.headers),
      data: option.data,
      encodeData: this.paramStringify ? this.paramStringify(option.data) : paramStringify(option.data),
      cancelToken: option.cancelToken,
      timeout: option.timeout || this.timeout,
      uploader: option.uploader
    }

    const job = new Job()
    job.addTask(() => Promise.resolve(config))
    // request interceptors
    this.interceptor.requestInterceptors.forEach((item) => {
      job.addTask(...item)
    })
    // request
    job.addTask(this.xhr as ResolveFun)
    // response interceptors
    this.interceptor.responseInterceptors.forEach((item) => {
      job.addTask(...item)
    })
    const result = new Promise<any>((resolve, reject) => {
      // 当job在queue中等待时的cancelToken, 取消job直接返回
      if(typeof config.cancelToken === 'function') {
        config.cancelToken(() => {
          job.cancel()
          reject({ code: -1, message: "request:aborted" })
        })
      }
      job.addTask(resolve, reject)
    })

    if (option.enforce === "pre") {
      this.queue.unshift(job)
    } else {
      this.queue.push(job)
    }

    return result
  }

  public get<T>(path: string, params?: { [key: string]: number|string }, options?: MethodRequestOptions) {
    const _options = Object.assign({}, options, {
      path: path,
      method: 'GET',
      params: Object.assign({}, options?.params, params)
    }) as RequestOption
    return <Promise<T>>this.request.call(this, _options)
  }

  public post<T>(path: string, data?: any, options?: MethodRequestOptions) {
    const _options = Object.assign({}, options, {
      path: path,
      method: 'POST',
      data: Object.assign({}, options?.data, data)
    }) as RequestOption
    return <Promise<T>>this.request.call(this, _options)
  }

  public put<T>(path: string, data?: any, options?: MethodRequestOptions) {
    const _options = Object.assign({}, options, {
      path: path,
      method: 'PUT',
      data: Object.assign({}, options?.data, data)
    }) as RequestOption
    return <Promise<T>>this.request.call(this, _options)
  }

  public delete<T>(path: string, data?: any, options?: MethodRequestOptions) {
    const _options = Object.assign({}, options, {
      path: path,
      method: 'DELETE',
      data: Object.assign({}, options?.data, data)
    }) as RequestOption
    return <Promise<T>>this.request.call(this, _options)
  }
}