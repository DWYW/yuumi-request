

## quick start

```bash
npm install yuumi-request --save
```

```ts
import YuumiRequest from 'yuumi-request'

new YuumiRequest({
  requestMaxCount?: number,
  baseURI?: string,
  headers?: {
    [key: string]: string
  }
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
  upload?: { [key: string]: EventListener }
  level? : 'WAITING'|'PENDING'|'COMPLETED'
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
  upload?: { [key: string]: EventListener }
  level? : 'WAITING'|'PENDING'|'COMPLETED'
})

new YuumiRequest()['post'|'put'|'delete'](path, data, {
  async?: boolean
  headers?: { [key: string]: string }
  params?: { [key: string]: number|string|(<number|string>[]) }
  data?: any
  timeout?: number
  cancelToken?: (cancel?: () => void) => void
  upload?: { [key: string]: EventListener }
  level? : 'WAITING'|'PENDING'|'COMPLETED'
})
```

## interceptors

```ts
const request = new YuumiRequest()
request.interceptors.request((data: any) => Promise.resolve(data), (reason?: any) => Promise.reject(reason))
request.interceptors.request((data: any) => Promise.resolve(data), (reason?: any) => Promise.reject(reason))
```

