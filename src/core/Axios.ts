import {
  AxiosRequestConfig,
  AxiosPromise,
  Method,
  AxiosResponse,
  ResolvedFn,
  RejectedFn
} from '../types'
import InterceptorManager from './interceptorManager'
import dispatchRequest from './dispatchRequest'

interface PromiseArr<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

export default class Axios {
  private interceptors: {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse<any>>
  }
  constructor() {
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      config = config ? config : {}
      config.url = url
    } else {
      config = url
    }

    // 先把dispatchRequest存入，发送数据
    let arr: PromiseArr<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]
    // 请求拦截器 头部插入
    this.interceptors.request.interceptors.forEach(interceptors => {
      if (interceptors !== null) {
        arr.unshift(interceptors)
      }
    })
    // 响应拦截器尾部插入
    this.interceptors.response.interceptors.forEach(interceptors => {
      if (interceptors !== null) {
        arr.push(interceptors)
      }
    })
    // 这里放入了config
    let promise = Promise.resolve(config)
    console.log(promise)
    // Promise一直不断then 会把config的配置不断更新
    // 因为 resolve一个Promise对象返回的是这个Promise的结果和值
    while (arr.length) {
      const { resolved, rejected } = arr.shift()!
      promise = promise.then(resolved, rejected)
      console.log(promise)
    }

    return promise
  }
  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }
  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }

  _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}
