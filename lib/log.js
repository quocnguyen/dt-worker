'use strict'

const logger = require('pino')()

logger.level = process.env.LOG_LEVEL || 'debug'

module.exports = logger
