import { AxiosRequestConfig, AxiosPromise } from './types'
import { bulidURL } from './helpers/url'
import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/headers'
import xhr from './xhr'

function axios(config: AxiosRequestConfig): AxiosPromise {
  // 处理config
  processConfig(config)
  //   发送请求
  return xhr(config)
}

// 添加头部
function transformHeaders(config: AxiosRequestConfig) {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.data = transformRequestData(config)
  config.headers = transformHeaders(config)
}
// 处理使用params的情况
function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return bulidURL(url, params)
}
// 处理使用data的情况
function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}
export default axios
