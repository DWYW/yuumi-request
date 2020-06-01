

## quick start

```bash
npm install yuumi-request --save
```

```ts
import YuumiRequest from 'yuumi-request'

new YuumiRequest({
  maximum?: number,
  baseURI?: string,
  headers?: {
    [key: string]: string
  }
})
```

## request

``` ts
new YuumiRequest().request({
  path: string,
  method: string,
  async?: boolean,
  headers?: {
    [key: string]: string
  },
  // params for request uri.
  params?: {
    [key: string]: any
  },
  // params for send data
  data?: {
    [key: string]: any
  },
  // xhr.upload
  upload?: {
    loadstart: () => any,
    progress: () => any,
    load: () => any
  },
  timeout?: number,
  cancelToken?: (cancel: () => void) => void,
  // default normarl
  level?: 'high' | 'normarl' | 'low'
})
```

## get, post, delete, put

```ts
new YuumiRequest()['get'](path, params, {
  async?: boolean,
  headers?: {
    [key: string]: string
  },
  params?: {
    [key: string]: string|number
  },
  timeout?: number,
  cancelToken?: (cancel: () => void) => void,
  level?: 'high' | 'normarl' | 'low'
})

new YuumiRequest()['post'|'put'|'delete'](path, data, {
  async?: boolean,
  headers?: {
    [key: string]: string
  },
  params?: {
    [key: string]: string|number
  },
  timeout?: number,
  cancelToken?: (cancel: () => void) => void,
  level?: 'high' | 'normarl' | 'low'
})
```

## interceptors

```ts
const request = new YuumiRequest()
request.interceptors.request((data: any) => any, (reason?: any) => any)
request.interceptors.request((data: any) => any, (reason?: any) => any)
```

