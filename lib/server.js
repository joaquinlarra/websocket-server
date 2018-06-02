'use strict'

const WebSocket = require('ws')
const {EventEmitter} = require('events')
const parser = require('./parser')
const loadPlugins = require('./plugin-loader')

class WizzyServer extends EventEmitter {
  constructor(options) {
    super()
    this.options = options
    this.plugins = loadPlugins({
      debug: process.env.NODE_ENV !== 'production',
      plugins: this.options.plugins
    })
    this.server = new WebSocket.Server(this.options)
  }
  start() {
    this
      .server
      .on('connection', (ws) => {
        ws.sendMessage = function (kind, value = {}) {
          this.send(JSON.stringify({
            kind,
            ...value
          }))
        }
        ws.on('message', parser(ws, this.plugins))
      })
  }
}

module.exports = WizzyServer
