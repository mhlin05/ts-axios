import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isFormData } from '../helpers/util'
import isURLSameOrigin from '../helpers/isURLSameOrigin'
import cookies from '../helpers/cookies'
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config
    // 1、创建XMLHttpRequest异步对象
    const request = new XMLHttpRequest()
    // 2、配置请求参数
    request.open(method.toUpperCase(), url!, true)
    // 通过FormData上传文件时 Content-Type不能用
    if (isFormData(data)) {
      delete headers['Content-Type']
    }
    let xsrfValue =
      (withCredentials || isURLSameOrigin(url!)) && xsrfCookieName
        ? cookies.read(xsrfCookieName)
        : undefined

    if (xsrfValue) {
      headers[xsrfHeaderName!] = xsrfValue
    }
    if (auth) {
      const username = auth.username || ''
      const password = auth.password || ''
      headers['Authorization'] = 'Basic ' + btoa(username + ':' + password)
    }
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
    if (timeout) {
      request.timeout = timeout
    }
    if (withCredentials) {
      request.withCredentials = true
    }

    // 下载上传进度设置
    if (onDownloadProgress) {
      request.onprogress = onDownloadProgress
    }

    if (onUploadProgress) {
      request.upload.onprogress = onUploadProgress
    }
    // if (auth) {
    //   const username = auth.username || ''
    //   const password = auth.password || ''
    //   headers['Authorization'] = 'Basic ' + btoa(username + ':' + password)
    // }
    // 3、发送请求
    request.send(data)
    // 实现请求取消逻辑
    if (cancelToken) {
      cancelToken.promise.then(reason => {
        request.abort()
        reject(reason)
      })
    }
    // 4、注册事件，获取响应数据
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }
      if (request.status === 0) {
        return
      }
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
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
      handleResponse(response)
    }
    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request.status,
            response
          )
        )
      }
    }
    // 网络不通情况
    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }
    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }
  })
}
