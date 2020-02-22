import NetworkRequest from '../request'
import { _RequestLevel, _NetworkRequestCtor, _RequestQueueCtor, _RequestQueueAddItemOptions } from '../interface'

class RequestQueue {
  private _isRunning: boolean = false
  private _options: _NetworkRequestCtor
  private _running: any[] = []
  private _waiting: any = {
    primary: [],
    secondary: []
  }

  private maximum: number

  constructor (options: _RequestQueueCtor) {
    const { maximum, ...params } = options
    this._options = params
    this.maximum = maximum || 4
  }

  addItem (options: _RequestQueueAddItemOptions, resolve: (value?: any) => void, reject: (value?: any) => void): void {
    const instance = new NetworkRequest(this._options)
    const level = options.level || 'primary'
    const complete = options.complete

    options.complete = () => {
      complete && complete()

      // remove this from running
      const index = this._running.findIndex(item => item._id === instance._id)
      this._running.splice(index, 1)

      // exec next request
      !this._isRunning && this.run()
    }

    this._waiting[level].push({
      options: options,
      instance: instance,
      run: () => {
        instance.request(options).then(resolve, reject)
        return instance
      }
    })

    // cancelToken
    if (options.cancelToken) {
      options.cancelToken(() => {
        const index = this._waiting[level].findIndex((item: any) => item.instance._id === instance._id)

        if (index > -1) {
          this._waiting[level].splice(index, 1)
          options.cancelToken(undefined)
        }
      })
    }

    !this._isRunning && this.run()
  }

  private run () {
    if (this._running.length >= this.maximum) {
      this._isRunning = false
      return
    }

    if (!this._isRunning) {
      this._isRunning = true
    }

    const next = this._waiting.primary.shift() || this._waiting.secondary.shift()

    if (next) {
      this._running.push(next.run())
      this.run()
    } else {
      this._isRunning = false
    }
  }
}

export default RequestQueue
