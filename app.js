'use strict'

const WebSocket = require('ws')
const Config = require('config')

const server = new WebSocket.Server({
  port : Config.get('wsPort'),
})
server.on('connection', (ws) => {
  ws.on('message', (message) => {
    
  })
})
