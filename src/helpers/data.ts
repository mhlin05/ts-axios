import { isObject } from './util'

export function transformRequest(data: any): any {
  if (isObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

// 解决data是字符串 尝试转换成一个JSON对象
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }
  return data
}
