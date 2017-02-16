'use strict'

const got = require('got')
const log = require('./log')

module.exports = (docId) => {
  return Promise.all([
    posiblePromise(fetchUseMailDomain(docId)),
    posiblePromise(fetchUseDrive(docId))
  ])
  .then(result => {
    const [resultFromMail, resultFromDrive] = result
    if (resultFromMail !== null) {
      return Promise.resolve(resultFromMail)
    }
    if (resultFromDrive !== null) {
      return Promise.resolve(resultFromDrive)
    }
    return Promise.resolve(null)
  })
}

// exploit using get_video_info on mail domain
const fetchUseMailDomain = (docId) => {
  return got(`https://mail.google.com/a/e/nodeepshit.com/get_video_info?docid=${docId}`, {
    headers: {
      'user-agent': process.env.USER_AGENT,
      'cookie': process.env.COOKIE
    }
  })
}

// fallback using get_video_info on drive domain
const fetchUseDrive = (docId) => {
  return got(`https://drive.google.com/get_video_info?docid=${docId}`, {
    headers: {
      'user-agent': process.env.USER_AGENT
    }
  })
}

// promise that never reject
// it will resolve to defaultValue on error
const posiblePromise = (p, defaultValue = null) => {
  return new Promise(resolve => {
    p.then(resolve).catch(err => {
      log.error(err)
      resolve(defaultValue)
    })
  })
}
