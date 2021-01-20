import QueueItem, { emptyFun, ItemStatus, QueueItemCtor }  from './item'

export const queue = {
  running: <QueueItem[]> [],
  waiting: {
    HIGH: <QueueItem[]> [],
    NORMAL: <QueueItem[]> [],
    LOW: <QueueItem[]> []
  }
}
export let maxCount = 4
export function setMaxCount (count: number) {
  maxCount = Math.max(count, 2)
}

export function addQueueItem (config: QueueItemCtor) {
  const item = new QueueItem(config)

  if (!queue.waiting[item.level]) return

  queue.waiting[item.level].push(item)

  // 设置取消设置
  setBeforeRunningCancelToken(item)

  setTimeout(() => {
    waitingExec()
  }, 0)
}

function setBeforeRunningCancelToken (instance: QueueItem) {
  if (!instance.$config.cancelToken) return

  instance.$config.cancelToken(function () {
    switch (instance.status) {
      case ItemStatus.WAITING:
        const index = queue.waiting[instance.level].findIndex(item => item === instance)

        if (index > -1) {
          queue.waiting[instance.level].splice(index, 1)
        }
        break
    }

    let promise = Promise.reject(new Error('request:aborted')) as Promise<Error>

    if (instance.$config.interceptor.responseInterceptros) {
      instance.$config.interceptor.responseInterceptros.forEach(([fulfilled, rejected]: any) => {
        promise = promise.then(fulfilled, rejected)
      })
    }

    promise.catch((error: Error) => {
      instance.$config.reject(error)
    })
  })
}

function waitingExec () {
  if (queue.running.length >= maxCount) return

  const next = queue.waiting.HIGH.shift() || queue.waiting.NORMAL.shift() || queue.waiting.LOW.shift()
  if (!next) return

  queue.running.push(next)

  next.run().finally(() => {
    //  移除已完成的请求
    if (next.$config.cancelToken) {
      next.$config.cancelToken(emptyFun)
    }

    const index = queue.running.findIndex(item => item === next)
    if (index > -1) {
      queue.running.splice(index, 1)
    }

    waitingExec()
  })
}