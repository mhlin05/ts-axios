// 拦截器类
import { ResolvedFn, RejectedFn } from '../types'

// 拦截器类型
interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}
export default class InterceptorManager<T> {
  // 存放所有拦截器
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    // 返回该对象在数组中的索引作为该拦截器的id
    return this.interceptors.length - 1
  }
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}
