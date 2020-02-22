import { _RequestMethod, _object, createXHROptions } from '../interface'

function getRequestFullPath (path: string, data: _object<string|number> = {}) {
  const items = []
  const char = /\?/.test(path) ? '&' : '?'

  for (const key in data) {
    items.push(`${key}=${data[key].toString()}`)
  }

  return /\?/.test(path) ? `${path}${char}${items.join('&')}` : `${path}${char}${items.join('&')}`
}

export default function createXHR (options: createXHROptions): Promise<any> {
  return new Promise((resolve, reject) => {
    const { url, method, headers, data, query, async, upload, complete, timeout, cancelToken } = options
    const xhr = new XMLHttpRequest()
    let sendType = ''

    xhr.open(method, getRequestFullPath(url, query), async)

    // headers
    if (headers) {
      for (const key in headers) {
        xhr.setRequestHeader(key, headers[key])

        if (/application\/json/.test(headers[key])) {
          sendType = 'json'
        }
      }
    }

    // cancelToken
    cancelToken && cancelToken(function () {
      xhr.abort()
    })

    // events
    xhr.addEventListener('error', (event) => {
      cancelToken && cancelToken(undefined)
      reject(event)
    })

    xhr.addEventListener('abort', (event) => {
      cancelToken && cancelToken(undefined)
      reject(event)
    })

    xhr.addEventListener('timeout', (event) => {
      cancelToken && cancelToken(undefined)
      reject(event)
    })

    complete && xhr.addEventListener('loadend', complete)

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        cancelToken && cancelToken(undefined)

        resolve({
          request: options,
          response: xhr.response
        })
      }
    })

    // upload
    if (upload) {
      for (const event in upload) {
        xhr.upload.addEventListener(event, upload[event])
      }
    }

    if (timeout) {
      xhr.timeout = timeout
    }

    // send data.
    if (method === 'GET') {
      xhr.send()
    } else {
      switch (sendType) {
        case 'json':
          xhr.send(JSON.stringify(data))
          break
        default:
          xhr.send(data)
      }
    }
  })
}
