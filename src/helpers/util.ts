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
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

//  header深度合并
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  for (let i = 0; i < objs.length; i++) {
    const obj = objs[i]
    for (let key in obj) {
      assignValue(obj[key], key)
    }
  }

  function assignValue(val: any, key: string) {
    if (isObject(result[key]) && isObject(val)) {
      result[key] = deepMerge(result[key], val)
    } else if (isObject(val)) {
      result[key] = deepMerge({}, val)
    } else {
      result[key] = val
    }
  }
  return result
}
export function isFormData(val: any): boolean {
  return typeof val !== 'undefined' && val instanceof FormData
}
