const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}
// 辅助函数extend
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    console.log(key)
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
