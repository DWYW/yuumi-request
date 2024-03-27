import { RequestMethod } from "./type"
import { isFormData, isNumber, dataRemoveEmpty, isBoolean } from "../utils"

export interface XHR_RequestOption {
  url: string
  method: RequestMethod
  headers?: Record<string, string>
  data?: Record<string, any>
  encodeData?: string
  cancelToken?: (cancel?: () => void) => void
  timeout?: number
  async?: boolean
  uploader?: { [key: string]: EventListener }
}

export class XHR {
  private url!: string
  private method!: RequestMethod
  private async!: boolean
  private headers?: Record<string, string>
  private data?: any
  private encodeData?: string
  private cancelToken?: (cancel?: () => void) => void
  private timeout?: number
  private uploader?: { [key: string]: EventListener }

  constructor(option: XHR_RequestOption) {
    this.url = option.url
    this.method = option.method
    this.async = isBoolean(option.async) ? option.async! : true
    this.headers = option.headers
    this.data = option.data
    this.cancelToken = option.cancelToken
    this.timeout = option.timeout
    this.uploader = option.uploader
  }

  exec<T>():Promise<T> {
    const proxy: any = {}
    const promise = new Promise<T>((resolve, reject) => {
      proxy.resolve = resolve
      proxy.reject = reject
    })

    const xhr = new XMLHttpRequest()
    xhr.open(this.method, this.url, this.async)
    this.setHeaders(xhr)

    this.addTimeoutListener(xhr, () => {
      proxy.reject({ code: -1, message: "request:timeout" })
    })

    this.addAbortListener(xhr, () => {
      proxy.reject({ code: -1, message: "request:aborted" })
    })

    this.addUploadListener(xhr)

    xhr.addEventListener("error", (e) => {
      proxy.reject({ code: -1, message: e.toString() })
    })

    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState === 4 && xhr.status !== 0) {
        if (/^20[01234]$/.test(xhr.status.toString())) {
          proxy.resolve({
            request: this,
            status: xhr.status,
            response: xhr.response
          })
        } else {
          proxy.reject({
            request: this,
            status: xhr.status,
            response: xhr.response
          })
        }
      }
    })

    this.sendData(xhr)
    return promise
  }

  private sendData (xhr: XMLHttpRequest) {
    if (/get/i.test(this.method) || !this.data) {
      return xhr.send(undefined)
    }

    const headers = this.headers
    if (isFormData(this.data)) {
      xhr.send(this.data)
    } else if (headers && /application\/json/i.test(headers['Content-Type'])) {
      xhr.send(JSON.stringify(this.data))
    } else if (headers && /application\/x-www-form-urlencoded/i.test(headers['Content-Type'])) {
      xhr.send(this.encodeData)
    } else {
      xhr.send(this.data)
    }
  }

  private setHeaders(xhr: XMLHttpRequest) {
    if (!this.headers) return

    for (const key in this.headers) {
      if (!this.headers.hasOwnProperty(key)) continue
      xhr.setRequestHeader(key, this.headers[key])
    }
  }

  private addTimeoutListener (xhr: XMLHttpRequest, listener: EventListener) {
    const timeout = this.timeout
    if (timeout && isNumber(timeout) && timeout > 0) {
      xhr.timeout = timeout
    }

    xhr.addEventListener("timeout", listener)
  }

  private addAbortListener  (xhr: XMLHttpRequest, listener: EventListener) {
    xhr.addEventListener("abort", listener)

    const cancelToken = this.cancelToken
    if (typeof cancelToken !== "function") return

    cancelToken(() => xhr.abort())

    // reset cancel token to undefined
    xhr.addEventListener("error", () => {
      cancelToken()
    })
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState === 4 && xhr.status !== 0) {
        cancelToken()
      }
    })
  }

  private addUploadListener (xhr: XMLHttpRequest) {
    if (!this.uploader) return

    for (const event in this.uploader) {
      if (!this.uploader.hasOwnProperty(event)) continue
      xhr.upload.addEventListener(event, this.uploader[event])
    }
  }
}