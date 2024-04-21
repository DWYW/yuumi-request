import { Job } from "./job"

export interface QueueCtorOptions {
  // 并发数量[default: 4]
  concurrency?: number
  // 自动开始
  autoStart?: boolean
}

interface QueueLisenters {
  fail: Function[]
  start: Function[]
  stop: Function[]
  end: Function[]
}

export enum QueueStatus {
  DEFAULT = 0,
  STARTING,
  STOPED,
  ENDED
}

export class Queue {
  private jobs: Job[] = []
  private status: QueueStatus = QueueStatus.DEFAULT
  private session = 0
  private concurrency: number

  constructor(jobs?: Job[], options?: QueueCtorOptions) {
    if (jobs) {
      this.jobs = jobs
    }

    const { concurrency, autoStart } = Object.assign({
      concurrency: 4,
      autoStart: false
    }, options)

    this.concurrency = concurrency
    if (autoStart) {
      this.start()
    }
  }

  private _run() {
    if (this.status > QueueStatus.STARTING) return
    if (this.session >= this.concurrency) return
    const job = this.jobs.shift()
    if (!job) return

    this.session++
    job.addLisenter("afterXHR", () => {
      this.session--
    })

    job.run().finally(() => this._run()).catch((err) => {
      this.dispatch("fail", err)
    })

    this._run()
  }

  /**
   * 开始运行
   */
  start() {
    if (this.status === QueueStatus.STARTING) return
    this.status = QueueStatus.STARTING
    this._run()
    this.dispatch("start")
  }

  /**
   * 停止运行
   */
  stop() {
    if (this.status === QueueStatus.STOPED) return
    this.status = QueueStatus.STOPED
    this.dispatch("stop")
  }

  /**
   * 结束运行
   */
  end() {
    if (this.status === QueueStatus.ENDED) return
    this.status = QueueStatus.ENDED
    this.jobs = []
    this.dispatch("end")
  }

  /**
   * 在末尾添加一个工作
   * @param job 工作
   */
  push(job: Job) {
    if (job.constructor.name !== Job.name) return
    this.jobs.push(job)

    if (this.status === QueueStatus.STARTING) {
      this._run()
    }
  }

  /**
   * 在开始添加一个工作
   * @param job 工作
   */
  unshift(job: Job) {
    if (job.constructor.name !== Job.name) return
    this.jobs.unshift(job)

    if (this.status === QueueStatus.STARTING) {
      this._run()
    }
  }

  /** 事件监听 */
  private lisenters: QueueLisenters = {
    fail: [],
    start: [],
    stop: [],
    end: []
  }

  private dispatch(name: keyof QueueLisenters, value?: unknown) {
    this.lisenters[name].forEach((item) => item(value))
  }

  addLisenter(name: keyof QueueLisenters, lisenter: (value?: unknown) => void) {
    this.lisenters[name].push(lisenter)
  }

  removeListenr(name: keyof QueueLisenters, lisenter: (value?: unknown) => void) {
    const index = this.lisenters[name].findIndex((item) => item === lisenter)
    if (index >= 0) {
      this.lisenters[name].splice(index, 1)
    }
  }
}