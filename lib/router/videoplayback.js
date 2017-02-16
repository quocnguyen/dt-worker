'use strict'

const qs = require('querystring')
const base64 = require('base64url')
const got = require('got')
const handleError = require('../handle-error')

module.exports = (req, res) => {
  if (!req.query.hash) throw new Error()
  const upstream = JSON.parse(base64.decode(req.query.hash))

  delete req.query.hash
  delete req.query.driveid

  const query = qs.stringify(req.query)
  const originVideo = {
    url: `${upstream.domain}/videoplayback?${query}`,
    cookie: upstream.cookie
  }

  const headers = Object.assign({}, req.headers, {
    cookie: originVideo.cookie
  })

  // do not let upstream know about host and referer
  delete headers.host
  delete headers.referer

  got.stream(originVideo.url, { headers })
    .on('response', (response) => {
      res.statusCode = response.statusCode
      Object.keys(response.headers).forEach(key => {
        res.setHeader(key, response.headers[key])
      })
    })
    .on('error', handleError)
    .pipe(res)
}
