'use strict'

module.exports = {
  wsPort : process.env.WIZZY_WS_PORT,
  ssl : {
    cert : process.env.WIZZY_SSL_CERT,
    key : process.env.WIZZY_SSL_KEY,
  },
  plugins : [
    {
      name : 'Hello World',
      module : 'hello-world',
      kinds : ['hello'],
    },
  ],
}
