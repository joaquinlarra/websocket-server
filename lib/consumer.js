'use strict'

const UUID = require('uuid/v4')

class WizzyConsumer {
  constructor(ws) {
    this.ws = ws
    this.id = UUID()
  }
  sendMessage(kind, value = {}) {
    this.ws.send(
      JSON.stringify({
        kind,
        ...value,
      })
    )
  }
  sendError(errData = {}) {
    this.sendMessage('error', errData)
  }
}

module.exports = WizzyConsumer
