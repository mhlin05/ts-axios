import Cancel from './Cancel'

// 判断是否为Cancel的实例对象
export default function isCancel(val: any): boolean {
  return val instanceof Cancel
}
