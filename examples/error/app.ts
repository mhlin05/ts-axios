import axios from '../../src/index'
// axios({
//   method: 'get',
//   url: '/error/get1'
// })
//   .then(res => {
//     console.log(res)
//   })
//   .catch(e => {
//     console.log(e)
//   })

// axios({
//   method: 'get',
//   url: '/error/get'
// })
//   .then(res => {
//     console.log(res)
//   })
//   .catch(e => {
//     console.log(e)
//   })

// setTimeout(() => {
//   axios({
//     method: 'get',
//     url: '/error/get'
//   })
//     .then(res => {
//       console.log(res)
//     })
//     .catch(e => {
//       console.log(e)
//     })
// }, 1000)

axios({
  method: 'get',
  url: '/error/timeout',
  timeout: 2000
})
  .then(res => {
    console.log(111)
    console.log(res)
  })
  .catch((e: AxiosError) => {
    console.log(e)
    console.log(e.message)
    console.log(e.code)
  })
