export declare interface _object<T> {
  [kye: string]: T
}

export declare type _RequestType = 'GET'|'POST'|'PUT'|'DELETE'|'OPTIONS'

export declare type _InterceptorItem = {
  resolve: (data: any) => any
  reject: (reason?: any) => any
}

export declare class _Interceptors {
  requestInterceptors: _InterceptorItem[]
  responseInterceptors: _InterceptorItem[]
  request (resolve: _InterceptorItem['resolve'], reject?: _InterceptorItem['reject'])
  response (resolve: _InterceptorItem['resolve'], reject?: _InterceptorItem['reject'])
}

export declare class _HTTPRequest {
  constructor(options: _HTTPRequestCtorOptions)

  readonly id: number
  readonly options:_HTTPRequestCtorOptions

  isCancel: boolean
  interceptors:_Interceptors
  resolve: _InterceptorItem['resolve']
  reject: _InterceptorItem['reject']
  exec: () => Promise<any>
}

export declare interface _HTTPRequestCtorOptions extends _XMLHttpRequestCtorOptions{
  baseURI: string
}

export declare interface _XMLHttpRequestCtorOptions extends _YuumiRequestOptions {
  path: string
  method: _RequestType
}

export declare interface _YuumiRequestOptions {
  async?: boolean
  level?: 'high'|'normal'|'low'
  headers?: _object<string>
  params?: _object<string|number>
  data?: _object<any>
  timeout?: number
  cancelToken?: (cancel: any) => void
  upload?: {
    loadstart?: () => any;
    progress?: () => any;
    load?: () => any
  }
}

export declare interface _YuumiQueueCtorOptions {
  maximum?: number
}

export declare interface _YuumiRequestCtorOptions {
  maximum?: number
  baseURI?: string
  headers?: _object<string>
}

export default class YuumiRequest {
  constructor (options: _YuumiRequestCtorOptions)
  defaults: {
    baseURI: string
    headers: _object<string>
  }
  interceptors: _Interceptors
  request (options: _XMLHttpRequestCtorOptions): Promise<any>
  get (path: string, params: _object<any>, options: _YuumiRequestOptions): Promise<any>
  post (path: string, data: _object<any>, options: _YuumiRequestOptions): Promise<any>
  put (path: string, data: _object<any>, options: _YuumiRequestOptions): Promise<any>
  delete (path: string, data: _object<any>, options: _YuumiRequestOptions): Promise<any>
}