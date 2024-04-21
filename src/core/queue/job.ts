export enum JobStatus {
  WAITING,
  PENDING,
  FULLFILLED,
  REJECT,
  CANCELED
}

export type ResolveFun = (value: unknown) => any
export type RejectFun = (reason?: any) => any

interface JobInterface {
  addTask: (resolve: ResolveFun, reject?: RejectFun) => Job
  run: () => Promise<unknown>
  cancel: () => void
}

interface JobLisenters {
  success: Function[]
  fail: Function[]
  complete: Function[]
  cancel: Function[]
}

export class Job implements JobInterface {
  private status: JobStatus = JobStatus.WAITING
  private tasks:[ResolveFun, RejectFun?][]
  private abort?: RejectFun
  private complete?: Function

  constructor(tasks?:[ResolveFun, RejectFun?][]) {
    this.tasks = tasks || []
  }

  /**
   * 添加一个任务到工作
   * @param resolve Promise.resolve
   * @param reject Promise.reject
   * @returns Job
   */
  addTask(resolve: ResolveFun, reject?: RejectFun): Job {
    this.tasks.push([resolve, reject])
    return this
  }

  /**
   * 运行Job
   * @returns Promise
   */
  run(): Promise<unknown> {
    if (this.status === JobStatus.CANCELED) return Promise.reject({ code: -1, message: "job be canceled." })
    if (this.status !== JobStatus.WAITING) return Promise.reject({ code: -1, message: "job is runing." })
    this.status = JobStatus.PENDING

    const token = new Promise((resolve, reject) => {
      this.complete = () => {
        this.dispatch("complete")
        resolve(void 0)
      }
      this.abort = () => reject({ code: -1, message: "job be canceled." })
    })

    let promise = Promise.resolve()

    this.tasks.forEach(([resolve, reject]) => {
      if (typeof reject !== 'function') {
        reject = (reason) => Promise.reject(reason)
      }

      promise = promise.then((value) => {
        // 防止调用cancel后，后续还在走resolve
        if (this.status === JobStatus.CANCELED) {
          return Promise.reject({ code: -1, message: "job be canceled." })
        }

        return resolve(value)
      }, reject)
    })

    promise = promise.then((value) => {
      this.status = JobStatus.FULLFILLED
      this.dispatch("success", value)
      return value
    }, (reason) => {
      this.status = JobStatus.REJECT
      this.dispatch("fail", reason)
      return Promise.reject(reason)
    })

    return Promise.race([ promise, token ]).finally(() => {
      this.complete && this.complete
    })
  }

  cancel() {
    if (this.status !== JobStatus.WAITING && this.status !== JobStatus.PENDING) return
    this.abort && this.abort()
    this.status = JobStatus.CANCELED
    this.dispatch("cancel")
  }

  /** 事件监听 */
  private lisenters: JobLisenters & Record<string, Function[]> = {
    success: [],
    fail: [],
    complete: [],
    cancel: []
  }

  dispatch(name: string, value?: unknown) {
    if (!this.lisenters[name]) return
    this.lisenters[name].forEach((item) => item(value))
  }

  addLisenter(name: string, lisenter: (value?: unknown) => void) {
    if (!this.lisenters[name]) {
      this.lisenters[name] = []
    }
    this.lisenters[name].push(lisenter)
  }

  removeListenr(name: string, lisenter: (value?: unknown) => void) {
    if (!this.lisenters[name]) return
    const index = this.lisenters[name].findIndex((item) => item === lisenter)
    if (index >= 0) {
      this.lisenters[name].splice(index, 1)
    }
  }
}
