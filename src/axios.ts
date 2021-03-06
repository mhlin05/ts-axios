import { AxiosStatic, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaultes'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import isCancel from './cancel/isCancel'
import Cancel from './cancel/Cancel'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)

  return instance as AxiosStatic
}

const axios = createInstance(defaults)
axios.create = function(config: AxiosRequestConfig) {
  return createInstance(mergeConfig(this.defaults, config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel
export default axios
