# Wizzy - Your custom websocket server

## Installation

### Using NPM

```bash
$ npm install wizzy-server
```

### Using Yarn

```bash
$ yarn add wizzy-server
```

## Usage

```javascript
const WizzyServer = require('wizzy-server')
const server = new WizzyServer({
  port: 8081,
})
server.start()
```

Your websocket server is ready to listen on connections.

## Messages

Every message is JSON-formatted and must contain a `kind` property. This property will let the server know what plugin it must use to handle the message.

## Plugins

To make the websocket server do things, you will have to add _plugins_. Create a `plugins` directory on your root app folder and you are ready to write a plugin.

### Plugin Hello World example

`plugins/hello-world/index.js`

```javascript
'use strict'

const WizzyPlugin = require('wizzy-server/lib/plugin')

class HelloWorldPlugin extends WizzyPlugin {
  _run(ws) {
    ws.sendMessage('hello', {
      text: 'Hello World !',
    })
  }
}

module.exports = HelloWorldPlugin
```

This plugin will send a JSON formatted object with a `text` property containing the string `Hello World !` whenever it receives a message.

### Register the plugin

To register the plugin, you must add it to the server options constructor object.

```javascript
const WizzyServer = require('wizzy-server')
const server = new WizzyServer({
  port: 8081,
  plugins: [
    {
      name: 'Hello World Plugin',
      module: 'hello-world',
      kinds: ['hello'],
      global: false,
    },
  ],
})
server.start()
```

There are four properties for your plugin :

| Property     | Description                                                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`       | Name of the plugin. Can be whatever you want and has not to be unique.                                                                         |
| `module`     | Name of the plugin module. Must be the same as the plugin folder name (case-sensitive)                                                         |
| `kinds`      | Array of values matching with this plugin. If the `kind` property of the incoming message is one of these, the plugin will handle the message. |
| `global`     | Boolean value to make the plugin trigger on every message whatever the value of the `kind` property.                                           |
| `properties` | Plugin properties (additional configuration)                                                                                                   |

> If `kinds` is an empty array, the plugin will be loaded with a warning and will never be triggered. If you want a plugin to be triggered to every message, set `global` to `true`.

You can also add properties to your plugin, by setting

## Logging

The Wizzy Server is bundling a fully configured Bunyan logger. You can access it by use the `.logger` property of the server instance.

```javascript
const WizzyServer = require('wizzy-server')
const server = new WizzyServer({
  port: 8081,
  plugins: [
    {
      name: 'Hello World Plugin',
      module: 'hello-world',
      kinds: ['hello'],
      global: false,
    },
  ],
})
server.logger.debug('Test Log !')
server.start()
```

By default, the log is JSON formatted to ensure standard log outputs.

## Middlewares

You can attach middlewares (or event listeners) to the Wizzy server with three functions :

* `onConnection(Function(WebSocket.Client ws))`

This attaches a middleware right after connection as a function taking a single parameter, the connecting websocket client instance.

* `beforeMessage(Function(WebSocket.Client ws, String message))`

This attaches a middleware right before the message was parsed as a function taking two parameters, the first is the websocket client instance, the second is the raw received websocket message.

* `afterMessage(Function(WebSocket.Client ws, String message, any[] result))`

This attaches a middleware right after the message has been parsed as a function taking three parameters.
The first is the websocket client instance.
The second is the raw received websocket message.
The third is an array of results from all the plugins that have handled the message.
