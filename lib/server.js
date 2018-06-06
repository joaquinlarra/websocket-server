'use strict'

const WebSocket = require('ws')

const parser = require('./parser')
const loadPlugins = require('./plugin-loader')
const Logger = require('./log')
const wrapMiddleware = require('./middleware')
const WizzyConsumer = require('./consumer')

class WizzyServer {
  constructor(options) {
    this.logger = Logger
    this.options = options
    this.plugins = loadPlugins({
      debug : process.env.NODE_ENV !== 'production',
      plugins : this.options.plugins,
      server : this,
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
      const consumer = new WizzyConsumer(ws)

      this.consumers.push(consumer)

      for (const middleware of this.middlewares.onConnection) {
        await middleware(consumer)
      }

      ws.on('message', async (message) => {
        for (const middleware of this.middlewares.beforeMessage) {
          await middleware(consumer, message)
        }
        const result = await parser(consumer, this.plugins)(message)
        for (const middleware of this.middlewares.afterMessage) {
          await middleware(consumer, message, result)
        }
        return result
      })
    })
  }

  broadcast(kind, message, exclude = []) {
    for (const consumer of this.consumers.filter((ws) => !exclude.includes(ws))) {
      consumer.sendMessage(kind, message)
    }
  }
}

module.exports = WizzyServer
