

## quick start

```bash
npm install yuumi-request --save
```

```ts
import YuumiRequest from 'yuumi-request'

new YuumiRequest({
  baseURI: string
  headers: Record<string, string>
  concurrency: number
  timeout: number
  // 自定义params格式化函数
  paramStringify?: (value: any) => string
  // 自定义xhr函数
  xhr?: <T>(option: XHR_RequestOption) => Promise<T>
})
```

## request

``` ts
new YuumiRequest().request({
  path: string
  method: RequestMethod
  async?: boolean
  headers?: { [key: string]: string }
  params?: { [key: string]: number|string|(<number|string>[]) }
  data?: any
  timeout?: number
  cancelToken?: (cancel?: () => void) => void
  uploader?: { [key: string]: EventListener }
  enforce? : "pre"|"normal"
})
```

## get, post, delete, put

```ts
new YuumiRequest()['get'](path, params, {
  async?: boolean
  headers?: { [key: string]: string }
  params?: { [key: string]: number|string|(<number|string>[]) }
  data?: any
  timeout?: number
  cancelToken?: (cancel?: () => void) => void
  uploader?: { [key: string]: EventListener }
  enforce? : "pre"|"normal"
})

new YuumiRequest()['post'|'put'|'delete'](path, data, {
  async?: boolean
  headers?: { [key: string]: string }
  params?: { [key: string]: number|string|(<number|string>[]) }
  data?: any
  timeout?: number
  cancelToken?: (cancel?: () => void) => void
  uploader?: { [key: string]: EventListener }
  enforce? : "pre"|"normal"
})
```

## interceptors

```ts
const request = new YuumiRequest()
request.interceptors.request((data: any) => Promise.resolve(data), (reason?: any) => Promise.reject(reason))
request.interceptors.request((data: any) => Promise.resolve(data), (reason?: any) => Promise.reject(reason))
```

