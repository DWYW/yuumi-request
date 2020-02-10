

## 快速开始

```bash
npm install yuumi-request --save
```

## 初始化

```js
import YuumiRequest from 'yuumi-request'

new YuumiRequest({
  maximum?: number,
  baseURI?: string,
  headers?: {},
  translateRequest?: [(data) => {
    return data
  }],
  translateResponse?: [(data) => {
    return JSON.parse(data.response)
  }]
})
```

## request

``` js
new YuumiRequest().request({
  path: string,
  method: string,
  async?: boolean,
  headers?: {
    [key: string]: string
  },
  // params for request uri.
  query?: {
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
  complete?: () => any,
  timeout?: number,
  cancelToken?: (cancel: () => void) => void,
  // default primary
  level?: 'primary' | 'secondary'
})
```

## get, post, delete, put

```js
new YuumiRequest()[method](path, {
  async?: boolean,
  headers?: {
    [key: string]: string
  },
  query?: {
    [key: string]: any
  },
  data?: {
    [key: string]: any
  },
  upload?: {
    loadstart: () => any,
    progress: () => any,
    load: () => any
  },
  complete?: () => any,
  timeout?: number,
  cancelToken?: (cancel: () => void) => void,
  level?: 'primary' | 'secondary'
})
```

