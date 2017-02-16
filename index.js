'use strict'

require('dotenv').config({silent: true})
const PORT = process.env.PORT || 6969
const log = require('./lib/log')
const server = require('./lib/server')
server.listen(PORT, () => {
  log.info(`http://0.0.0.0:${PORT}`)
})
