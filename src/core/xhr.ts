import { _XMLHttpRequestCtorOptions } from '../../types/index'
import helper from '../utils/helper'
import validator from '../utils/validator'

function getRequestURI (path: string, params = {}): string {
  const joinText = /\?/.test(path) ? '&' : '?'
  return path + joinText + helper.params2string(params)
}

function getSendData (options): any {
  const { method, data, headers } = options
  let sendData: any

  if (/get/i.test(method) === false) {
    const contentType = headers['Content-Type']

    if (/application\/json/i.test(contentType)) {
      sendData = JSON.stringify(data)
    } else {
      sendData = data
    }
  }

  return sendData
}

function setCancelToken (cancelToken: any, handle?: () => void): void {
  if (validator.is(cancelToken, Function)) cancelToken(handle)
}

function bindCancel (xhr: XMLHttpRequest, reject): void {
  xhr.addEventListener('abort', () => {
    reject(new Error('request:aborted'))
  })
}

function bindTimeout (xhr: XMLHttpRequest, reject, timeout): void {
  if (validator.is(timeout, Number)) {
    xhr.timeout = timeout
  }

  xhr.addEventListener('timeout', () => {
    reject(new Error('request:timeout'))
  })
}

function bindUpload (xhr: XMLHttpRequest, upload = {}): void {
  for (const event in upload) {
    xhr.upload.addEventListener(event, upload[event])
  }
}

export default function createXHR (options: _XMLHttpRequestCtorOptions): Promise<any> {
  const { path, method, params, data, headers, async, timeout, upload, cancelToken } = options
  const xhr = new XMLHttpRequest()

  return new Promise((resolve, reject) => {
    xhr.open(method, getRequestURI(path, params), async)

    if (validator.is(data, FormData)) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    for (const key in headers) {
      xhr.setRequestHeader(key, headers[key])
    }

    setCancelToken(cancelToken, () => (xhr.abort()))
    bindCancel(xhr, reject)
    bindTimeout(xhr, reject, timeout)
    bindUpload(xhr, upload)

    xhr.addEventListener('error', (e) => {
      reject(e)
    })

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4 && xhr.status !== 0) {
        resolve({
          request: options,
          status: xhr.status,
          response: xhr.status === 200 ? xhr.response : undefined
        })
      }
    })

    const sendData = getSendData(options)
    xhr.send(sendData)
  }).finally(() => {
    setCancelToken(cancelToken)
  })
}
