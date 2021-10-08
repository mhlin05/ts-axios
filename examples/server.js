const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const compiler = webpack(WebpackConfig)

const router = express.Router()
app.use(webpackHotMiddleware(compiler))
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/__build__/',
    stats: {
      colors: true,
      chunks: false
    }
  })
)
app.use(express.static(__dirname))
router.get('/simple/get', function(req, res) {
  res.json({
    msg: `hello world`
  })
})
router.get('/base/get', function(req, res) {
  res.json(req.query)
})

router.post('/base/post', function(req, res) {
  // console.log('???')
  // console.log(res.body)
  // console.log(req)
  res.json({
    a: 1,
    b: 2
  })
})

router.post('/base/buffer', function(req, res) {
  let msg = []
  // console.log(req)
  req.on('data', chunk => {
    if (chunk) {
      msg.push(chunk)
    }
  })
  req.on('end', () => {
    let buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})
router.get('/error/get', function(req, res) {
  if (Math.random() > 0.5) {
    res.json({
      msg: `hello world`
    })
  } else {
    res.status(500)
    res.end()
  }
})

router.get('/error/timeout', function(req, res) {
  setTimeout(() => {
    res.json({
      msg: `hello world`
    })
  }, 3000)
})
//expand interface
// 扩展接口
router.get('/api/expandInterface/get', function(req, res) {
  res.json({
    msg: 'hello world'
  })
})

router.options('/api/expandInterface/options', function(req, res) {
  res.end()
})

router.delete('/api/expandInterface/delete', function(req, res) {
  res.end()
})

router.head('/api/expandInterface/head', function(req, res) {
  res.end()
})

router.post('/api/expandInterface/post', function(req, res) {
  res.json(req.body)
  // res.json('nima')
  console.log(req.body)
})

router.put('/api/expandInterface/put', function(req, res) {
  res.json(req.body)
})

router.patch('/api/expandInterface/patch', function(req, res) {
  res.json(req.body)
})
// axios增加参数
router.post('/api/addParameters', function(req, res) {
  res.json(req.body)
})
// 响应支持泛型
router.get('/api/getuser', function(req, res) {
  res.json({
    msg: 'hello world',
    data: { name: '难凉热血', age: 18 }
  })
})
// 默认配置合并
router.post('/api/mergeConfig', function(req, res) {
  res.json(req.body)
})
// 添加transformRequest 和 transformResponse
router.post('/api/transformData', function(req, res) {
  res.json(req.body)
})
// 添加create接口
router.post('/api/expandCreateInterface', function(req, res) {
  res.json(req.body)
})

// 取消请求
router.get('/api/cancel', function(req, res) {
  setTimeout(() => {
    res.json({
      msg: `hello world`
    })
  }, 3000)
})
// 防御XSRF
router.get('/api/defendXSRF', function(req, res) {
  res.cookie('XSRF-NLRX', 'NLRX')
  res.json(req.cookies)
})
router.get('/more/get', function(req, res) {
  console.log(req.cookies)
  res.json(req.cookies)
})
app.use(router)

const port = process.env.PORT || 8080
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
