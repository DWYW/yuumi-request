import { _InterceptorItem } from '../../types/index'

export default class Interceptors {
  requestInterceptors: _InterceptorItem[] = []
  responseInterceptors: _InterceptorItem[] = []

  request (resolve: _InterceptorItem['resolve'], reject?: _InterceptorItem['reject']): void {
    this.requestInterceptors.push({
      resolve: resolve,
      reject: reject
    })
  }

  response (resolve: _InterceptorItem['resolve'], reject?: _InterceptorItem['reject']): void {
    this.responseInterceptors.push({
      resolve: resolve,
      reject: reject
    })
  }
}
