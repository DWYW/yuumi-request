import RequestQueue, { RequestQueueConstructorOptions, AddItemOptions } from './queue'

declare interface YuumiRequestConstructorOptions extends RequestQueueConstructorOptions {}
declare interface _KV<T> {
  [key: string]: T
}

class YuumiRequest {
  private $queue: RequestQueue

  constructor (options: YuumiRequestConstructorOptions) {
    this.$queue = new RequestQueue(options)
  }

  private staticMethod (path: string, options: _KV<any>, method) {
    const { level, ..._options } = options

    return this.request(Object.assign({}, _options, {
      path: path,
      level: level,
      method: method
    }))
  }

  request (options: AddItemOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$queue.addItem(options, resolve, reject)
    })
  }

  get (path: string, options: _KV<any>) {
    return this.staticMethod(path, options, 'GET')
  }

  post (path: string, options: _KV<any>) {
    return this.staticMethod(path, options, 'POST')
  }

  put (path: string, options: _KV<any>) {
    return this.staticMethod(path, options, 'PUT')
  }

  delete (path: string, options: _KV<any>) {
    return this.staticMethod(path, options, 'DELETE')
  }
}

export default YuumiRequest
