import axios from '../../src/axios'
import { Canceler } from '../../src/types'

const CancelToken = axios.CancelToken
let cancel: Canceler

axios
  .get('/api/cancel', {
    cancelToken: new CancelToken(c => {
      cancel = c
    })
  })
  .catch(function(e) {
    console.log(e)
  })

setTimeout(() => {
  cancel('Operation canceled by the user')
}, 1000)

const source = CancelToken.source()

axios
  .get('/api/cancel', {
    cancelToken: source.token
  })
  .catch(function(e) {
    console.log(e)
  })

setTimeout(() => {
  source.cancel('Operation canceled by the user1111')
}, 1000)
