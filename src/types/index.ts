export interface AxiosRequestConfig {
  url: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
}

// 服务端响应数据类型接口
export interface AxiosResponse {
  data: any //服务端返回的数据
  status: number // HTTP 状态码
  statusText: string //状态消息
  headers: any //响应头
  config: AxiosRequestConfig // 请求配置对象
  request: any // 请求的 XMLHttpRequest 对象实例
}

export interface AxiosPromise extends Promise<AxiosResponse> {}

export type XMLHttpRequestResponseType = '' | 'arraybuffer' | 'blob' | 'document' | 'json' | 'text'
export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'Delete'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
