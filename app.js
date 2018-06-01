'use strict'

const WebSocket = require('ws')
const Config = require('config')
const parser = require('./lib/parser')

const server = new WebSocket.Server({
  port : Config.get('wsPort'),
})
server.on('connection', (ws) => {
  ws.sendMessage = function(kind, value = {}) {
    this.send(
      JSON.stringify({
        kind,
        ...value,
      })
    )
  }
  ws.on('message', parser(ws))
})
