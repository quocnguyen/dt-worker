'use strict'

const base64 = require('base64url')

const createProxyVideo = (video, cookie) => {
  return Object.assign({}, video, {
    provider: 'proxy',
    src: toProxyURL(video.originSrc, cookie)
  })
}

const toProxyURL = (url, cookie) => {
  const hash = base64(JSON.stringify({
    cookie,
    domain: url.split('/videoplayback?')[0]
  }))
  return `https://${process.env.VIRTUAL_HOST}/videoplayback?hash=${hash}&` +
  url.split('?').pop()
}

module.exports = {
  createProxyVideo: createProxyVideo
}
