'use strict'

const WizzyPlugin = require('../../lib/plugin')
const Schema = require('./schema')

class HelloWorldPlugin extends WizzyPlugin {
  constructor() {
    super()
    this.schema = Schema
  }

  _run(ws) {
    ws.sendMessage('hello', {
      text : 'Hello World !',
    })
  }
}

module.exports = HelloWorldPlugin
