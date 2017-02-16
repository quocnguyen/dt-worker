'use strict'

const fetchDriveEndpoint = require('../fetch-drive-endpoint')
const extractVideos = require('../extract-videos')
const proxy = require('../proxy')
const handleError = require('../handle-error')

const isValidProvider = (provider) => {
  const allowed = ['drive']
  return Boolean(allowed.indexOf(provider.toLowerCase()) !== -1)
}

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8')

  if (isValidProvider(req.params.provider) === false) {
    throw new Error('provider invalid')
  }

  fetchDriveEndpoint(req.params.id)
  .then(
    response => ({
      'videos': extractVideos(response.body),
      'driveCookieHeader': response.headers['set-cookie']
    })
  )
  .then(
    ({videos, driveCookieHeader}) => {
      const proxied = videos.map(
        video => proxy.createProxyVideo(video, driveCookieHeader)
      )
      const result = JSON.stringify({
        status: 'OK',
        data: [...videos, ...proxied].map(video => {
          delete video.originSrc
          return video
        })
      })

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json; charset=utf8')
      return res.end(result)
    }
  )
  .catch((err) => {
    handleError(err)
    res.statusCode = 200
    return res.end(JSON.stringify({
      status: 'FAIL',
      reason: err.toString()
    }))
  })
}

