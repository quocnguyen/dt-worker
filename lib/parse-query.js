'use strict'
const qs = require('querystring')
const url = require('url')

module.exports = (req, res, next) => {
  req.query = qs.parse(
    url.parse(req.url).query
  )
  next()
}
