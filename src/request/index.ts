import validator from '../utils/validator'
import createXHR, { RequestMethod, XHRConstructorOptions } from './xhr'

declare interface _KV<T> {
  [key: string]: T
}

export interface NetworkRequestConstructorOptions {
  baseURI?: string;
  headers?: _KV<string>;
  translateRequest?: ((request: any) => any)[];
  translateResponse?: ((response: any) => any)[];
}

export interface RequestOptions {
  path: string;
  method: string;
  async?: boolean;
  headers?: _KV<string>;
  query?: _KV<any>;
  data?: _KV<any>;
  upload?: {
    loadstart: () => any;
    progress: () => any;
    load: () => any
  };
  complete?: () => any;
  timeout?: number;
  cancelToken?: (cancel: () => void) => void;
}

class NetworkRequest {
  private _baseURI: string
  private _headers: _KV<string>
  private _translateRequest: ((response: any) => any)[]
  private _translateResponse: ((response: any) => any)[]
  public _id: string

  constructor (options: NetworkRequestConstructorOptions) {
    this._baseURI = options.baseURI || ''
    // Prevent impact on the next use of the upper layer.
    this._headers = Object.assign({}, options.headers)
    this._translateRequest = [].concat(options.translateRequest || [])
    this._translateResponse = [].concat(options.translateResponse || [])
    this.setRequestID()
  }

  private setRequestID () {
    const timeStamp = Date.now().toString(26)
    const random = Math.random().toString(26).slice(2)
    this._id = `${timeStamp}.${random}`
  }

  // Inspired by Axios.
  request (options: RequestOptions) {
    // Initalize request config width default value.
    this._translateRequest.unshift((data: any) => {
      return this.mergeRequestConfig(data, options)
    })

    // Create http request.
    this._translateRequest.push(createXHR)

    const translate = [].concat(this._translateRequest, this._translateResponse)
    let promise = Promise.resolve({
      url: this._baseURI,
      headers: this._headers,
      async: true
    })

    while (translate.length) {
      promise = promise.then(translate.shift())
    }

    return promise
  }

  mergeRequestConfig (data: any, options: RequestOptions): XHRConstructorOptions {
    const { path, method, headers, ..._options } = options
    const _method = options.method.toUpperCase() as RequestMethod
    const _headers = {}

    if (validator.typeof(options.data) === 'formdata') {
      _headers['Content-Type'] = 'multipart/form-data'
    }

    return {
      url: data.url + path,
      method: _method,
      async: validator.isEmpty(data.async) ? true : data.async,
      headers: Object.assign({}, data.headers, headers, _headers),
      ..._options
    }
  }
}

export default NetworkRequest
