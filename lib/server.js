'use strict'

const http = require('http')
const app = require('router')()

// middleware
app.use(require('./parse-query'))

// hide all url from spiderbot
app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain')
  res.end('User-agent: *\nDisallow: /')
})

// server endpoint
app.get('/videoplayback', require('./router/videoplayback'))
app.get('/:provider/:id',
  (req, res, next) => {
    if (
      req.headers['x-request-secret'] !== process.env.SECRET
    ) {
      return res.end('Bần tăng chỉ nghe lệnh phật tổ')
    }

    next()
  },
  require('./router/getVideos')
)

module.exports = http.createServer((req, res) => {
  app(req, res, require('finalhandler')(req, res))
})
