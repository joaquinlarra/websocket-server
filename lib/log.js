'use strict'

const Bunyan = require('bunyan')
const logger = Bunyan.createLogger({
  name : 'wizzy',
  streams : [
    {
      level : 'trace',
      path : 'wizzy-trace.log',
    },
    {
      level : process.env.NODE_ENV === 'production' ? 'error' : 'debug',
      stream : process.stdout,
    },
  ],
})

module.exports = logger
