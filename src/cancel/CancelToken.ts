import { Canceler, CancelExecutor, CancelTokenSource } from '../types'
import Cancel from './Cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<string>
  reason?: Cancel
  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    // 首先实例化了一个 pending 状态的 Promise 对象，
    // 然后用一个 resolvePromise 变量指向 resolve 函数。
    this.promise = new Promise<string>(resolve => {
      resolvePromise = resolve
    })

    executor(message => {
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message!)
      resolvePromise(this.reason)
    })
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    let token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
  throwIfRequested(): void {
    if (this.reason) {
      throw this.reason
    }
  }
}
