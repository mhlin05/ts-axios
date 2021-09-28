import { AxiosTransformer } from '../types'

// 该函数接收三个参数，待转换的数据data、待转换的headers以及所有的转换函数。
// 首先判断转换函数是否为空，若为空，表示不进行任何转换，则直接把data返回；
// 然后再判断转换函数是否为数组，若不为数组，则将其强制变成一个长度为1 的数组，这是为了下面可以统一遍历；
// 遍历所有的转换函数并执行，执行的时候每个转换函数返回的 data 会作为下一个转换函数的参数 data 传入。
export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
) {
  if (!fns) {
    return data
  }
  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  fns.forEach(fn => {
    data = fn(data, headers)
  })
  return data
}
