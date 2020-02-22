import RequestQueue from './queue'
import { _NoMethodRequestOptions, _RequestMethod, _RequestQueueAddItemOptions, _YuumiRequestCtor } from './interface'

class YuumiRequest {
  public $queue: RequestQueue

  constructor (options: _YuumiRequestCtor) {
    this.$queue = new RequestQueue(options)
  }

  private staticMethod (path: string, method: _RequestMethod, options?: _NoMethodRequestOptions): Promise<any> {
    const _options: _RequestQueueAddItemOptions = Object.assign({}, options, {
      path: path,
      method: method
    })
    return this.request(_options)
  }

  request (options: _RequestQueueAddItemOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$queue.addItem(options, resolve, reject)
    })
  }

  get (path: string, options?: _NoMethodRequestOptions): Promise<any> {
    return this.staticMethod(path, 'GET', options)
  }

  post (path: string, options?: _NoMethodRequestOptions): Promise<any> {
    return this.staticMethod(path, 'POST', options)
  }

  put (path: string, options?: _NoMethodRequestOptions): Promise<any> {
    return this.staticMethod(path, 'PUT', options)
  }

  delete (path: string, options?: _NoMethodRequestOptions): Promise<any> {
    return this.staticMethod(path, 'DELETE', options)
  }
}

export default YuumiRequest
