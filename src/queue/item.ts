import XHR, { XHRCtor } from "../request/xhr/index"
import { Interceptor } from '../interceptor'

export enum ItemStatus {
  WAITING = 'WAITING',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

export enum QueueItmeLevel {
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  LOW = 'LOW'
}

export interface QueueItemCtor extends XHRCtor {
  readonly resolve: (value?: unknown) => any
  readonly reject: (reason?: unknown) => any
  readonly interceptor: Interceptor
  level? : QueueItmeLevel
}

export function emptyFun () {}

export default class QueueItem {
  $config: QueueItemCtor
  interceptor: any
  status: ItemStatus
  level: QueueItmeLevel

  constructor (config: QueueItemCtor) {
    const { level, ...options } = config
    this.$config = options
    this.status = ItemStatus.WAITING
    this.level = level || QueueItmeLevel.NORMAL
  }

  run (): Promise<any> {
    this.status = ItemStatus.PENDING
    const { resolve, reject, interceptor, ...config } = this.$config
    const { requestInterceptors, responseInterceptros } = interceptor

    let promise = Promise.resolve(config)

    if (requestInterceptors) {
      requestInterceptors.forEach((item) => {
        promise = promise.then(item[0], item[1])
      })
    }

    promise = promise.then((config) => {
      return new XHR(config).run()
    }, emptyFun)

    if (responseInterceptros) {
      responseInterceptros.forEach((item) => {
        promise = promise.then(item[0], item[1])
      })
    }

    return promise.then(resolve, reject).then((response) => {
      this.status = ItemStatus.COMPLETED
      return response
    })
  }
}