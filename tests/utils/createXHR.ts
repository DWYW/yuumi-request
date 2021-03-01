interface MockXHROptions {
  status?: number
  duration?: number
}

export class MockXHR {
  _options: any
  xhr: any

  constructor (options?: MockXHROptions) {
    this._options = Object.assign({
      status: 200,
      duration: Math.floor((Math.random() * 20) + 40)
    }, options)

    const { status} = this._options
    this.xhr = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      addEventListener: (type: string, cb: any) => {
        this.xhr[`on${type}`] =  jest.fn().mockImplementation(cb)
      },
      readyState: 4,
      status,
      response: {},
    }
    window.XMLHttpRequest = jest.fn().mockImplementation(() => this.xhr) as any
  }

  response (data?: any, duration?: number) {
    if (data) {
      this.xhr.response = JSON.stringify(data)
    }

    setTimeout(() => {
      this.xhr['onreadystatechange']()
    }, duration || this._options.duration)
  }
}