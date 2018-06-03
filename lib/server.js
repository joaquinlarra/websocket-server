'use strict'

const WebSocket = require('ws')
const UUID = require('uuid/v4')

const parser = require('./parser')
const loadPlugins = require('./plugin-loader')
const Logger = require('./log')
const wrapMiddleware = require('./middleware')

class WizzyServer {
  constructor(options) {
    this.logger = Logger
    this.options = options
    this.plugins = loadPlugins({
      debug : process.env.NODE_ENV !== 'production',
      plugins : this.options.plugins,
    })
    this.middlewares = {
      onConnection : [],
      beforeMessage : [],
      afterMessage : [],
    }

    this.consumers = []

    this.server = new WebSocket.Server(this.options)
  }

  onConnection(middleware) {
    this.middlewares.onConnection.push(wrapMiddleware(middleware))
  }

  beforeMessage(middleware) {
    this.middlewares.beforeMessage.push(wrapMiddleware(middleware))
  }

  afterMessage(middleware) {
    this.middlewares.afterMessage.push(wrapMiddleware(middleware))
  }

  start() {
    this.server.on('connection', async (ws) => {
      ws.id = UUID()

      ws.sendMessage = function(kind, value = {}) {
        this.send(
          JSON.stringify({
            kind,
            ...value,
          })
        )
      }

      for (const middleware of this.middlewares.onConnection) {
        await middleware(ws)
      }

      ws.on('message', async (message) => {
        for (const middleware of this.middlewares.beforeMessage) {
          await middleware(ws, message)
        }
        const result = await parser(ws, this.plugins)(message)
        for (const middleware of this.middlewares.afterMessage) {
          await middleware(ws, message, result)
        }
        return result
      })
    })
  }
}

module.exports = WizzyServer
