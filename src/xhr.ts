import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType } = config
    // 1、创建XMLHttpRequest异步对象
    const request = new XMLHttpRequest()
    // 2、配置请求参数
    request.open(method.toUpperCase(), url, true)
    // 给请求添加header
    Object.keys(headers).forEach(name => {
      // 如果data为null content-type没有存在的意义
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })
    if (responseType) {
      request.responseType = responseType
    }
    // 3、发送请求
    request.send(data)
    // 4、注册事件，获取响应数据
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }
      const responseHeaders = request.getAllResponseHeaders()
      const responseData =
        responseType && responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      resolve(response)
    }
  })
}
