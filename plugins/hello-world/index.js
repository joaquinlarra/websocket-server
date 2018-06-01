'use strict'

module.exports = (ws) => {
  ws.sendMessage('hello', {
    text : 'Hello World !',
  })
}
