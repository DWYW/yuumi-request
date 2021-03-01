interface _InterceptorItem {
  [0]: (value: any) => any
  [1]: (reason: Error) => Promise<Error>
}

export class Interceptor {
  requestInterceptors: _InterceptorItem[] = []
  responseInterceptros: _InterceptorItem[] = []

  request(resolve: _InterceptorItem[0], reject: _InterceptorItem[1]) {
    this.requestInterceptors.push([resolve, reject])
  }

  response(resolve: _InterceptorItem[0], reject: _InterceptorItem[1]) {
    this.responseInterceptros.push([resolve, reject])
  }
}