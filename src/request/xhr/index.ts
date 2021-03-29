import validator from "../../utils/validator"
import helper from "../../utils/helper"

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface XHRBaseCtor {
  path: string
  method: RequestMethod
}

export interface XHRExtraCtor {
  async?: boolean
  headers?: { [key: string]: string }
  params?: { [key: string]: number|string }
  data?: any
  timeout?: number
  cancelToken?: (cancel?: () => void) => void
  upload?: { [key: string]: EventListener }
}

export interface XHRCtor extends XHRBaseCtor, XHRExtraCtor {}

export default class XHR {
  $config: XHRCtor
  url: string
  method: string
  async: boolean

  constructor (config: XHRCtor) {
    this.$config = config
    this.url = this.requestFullPath(config.path, config.params)
    this.method = config.method
    this.async = config.async || true
  }

  run (): Promise<any> {
    const xhr = new XMLHttpRequest()
    const proxy: any = {}
    const promise = new Promise((resolve, reject) => {
      proxy.resolve = resolve
      proxy.reject = reject
    })

    xhr.open(this.method, this.url, this.async)
    this.setHeaders(xhr)

    this.addTimeoutListener(xhr, () => {
      proxy.reject(new Error('request:timeout'))
    })

    this.addAbortListener(xhr, () => {
      proxy.reject(new Error('request:aborted'))
    })

    this.addUploadListener(xhr)

    xhr.addEventListener('error', (e) => {
      proxy.reject(e)
    })

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4 && xhr.status !== 0) {
        proxy.resolve({
          request: this.$config,
          status: xhr.status,
          response: xhr.status === 200 ? xhr.response : undefined
        })
      }
    })

    this.sendData(xhr)
    return promise
  }

  requestFullPath (path: string, params?: {[key: string]: number|string}) {
    const query = helper.params2string(params)
    if (!query) return path

    return `${path}${/\?/.test(path) ? '&' : '?'}${query}`
  }

  setHeaders (xhr: XMLHttpRequest) {
    const headers = this.$config.headers || (this.$config.headers = {})

    if (validator.is(this.$config.data, FormData)) {
      // Let the browser set it
      delete headers['Content-Type']
    }

    for (const key in headers) {
      xhr.setRequestHeader(key, headers[key])
    }
  }

  sendData (xhr: XMLHttpRequest) {
    const headers = this.$config.headers

    if (/get/i.test(this.method)) {
      xhr.send(null)
    } else {
      const data: any = this.$config.data

      if (headers && /application\/json/i.test(headers['Content-Type'])) {
        xhr.send(JSON.stringify(helper.dataRemoveEmpty(data)))
      } else if (headers && /application\/x-www-form-urlencoded/i.test(headers['Content-Type'])) {
        xhr.send(helper.params2string(data))
      } else {
        xhr.send(data)
      }
    }
  }

  addTimeoutListener (xhr: XMLHttpRequest, listener: EventListener) {
    const { timeout } = this.$config

    if (timeout && validator.is(timeout, Number)) {
      xhr.timeout = timeout
    }

    xhr.addEventListener('timeout', listener)
  }

  addAbortListener  (xhr: XMLHttpRequest, listener: EventListener) {
    const { cancelToken } = this.$config

    if (!cancelToken) return

    cancelToken(() => {
      xhr.abort()
    })

    xhr.addEventListener('abort', listener)
    // reset cancel token to undefined
    xhr.addEventListener('error', () => {
      cancelToken()
    })
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4 && xhr.status !== 0) {
        cancelToken()
      }
    })
  }

  addUploadListener (xhr: XMLHttpRequest) {
    const { upload } = this.$config
    if (!upload) return

    for (const event in upload) {
      xhr.upload.addEventListener(event, upload[event])
    }
  }
}