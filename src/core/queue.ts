import { _object, _HTTPRequest, _YuumiQueueCtorOptions } from '../../types/index'
import validator from '../utils/validator'

export default class RequestQueue {
  private maximum: number

  private inExec: _object<any> = {
    length: 0
  }

  private waiting = {
    high: [] as _HTTPRequest[],
    normal: [] as _HTTPRequest[],
    low: [] as _HTTPRequest[]
  }

  constructor (options: _YuumiQueueCtorOptions) {
    const { maximum } = options
    this.maximum = maximum || 4
  }

  addItem (request: _HTTPRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      request.reject = (reason?: any): void => {
        this.itemCompleted(request)
        reject(reason)
      }
      request.resolve = (value: any): void => {
        this.itemCompleted(request)
        resolve(value)
      }
      const { level } = request.options

      if (this.waiting[level]) {
        this.waiting[level].push(request)
      } else {
        this.waiting.normal.push(request)
      }

      this.exec()
      this.setCancelToken(request)
    })
  }

  exec (): void {
    if (this.inExec.length >= this.maximum) return

    let request: _HTTPRequest

    if (this.waiting.high.length) {
      request = this.waiting.high.shift()
    } else if (this.waiting.normal.length) {
      request = this.waiting.normal.shift()
    } else if (this.waiting.low.length) {
      request = this.waiting.low.shift()
    }

    if (request) {
      this.inExec.length++
      this.inExec[request.id] = request
      request.exec()
    }
  }

  setCancelToken (request: _HTTPRequest): void {
    const { level, cancelToken } = request.options

    if (!validator.is(cancelToken, Function)) return

    cancelToken(() => {
      const waiting = this.waiting[level] || this.waiting.normal
      const index = waiting.findIndex(item => item.id === request.id)

      // 异步操作，防止取消后发出请求
      request.isCancel = true

      if (index > -1) {
        waiting.splice(index, 1)
      }
    })
  }

  itemCompleted (request: _HTTPRequest): void {
    if (this.inExec[request.id]) {
      delete this.inExec[request.id]
      this.inExec.length--
    }

    this.exec()
  }
}
