# Wizzy - Your custom websocket server

## Installation

### Using NPM

```bash
$ npm install wizzy
```

### Using Yarn

```bash
$ yarn add wizzy
```

## Usage

```javascript
const WizzyServer = require('wizzy')
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

const WizzyPlugin = require('wizzy/lib/plugin')

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
const WizzyServer = require('wizzy')
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

| Property | Description                                                                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`   | Name of the plugin. Can be whatever you want and has not to be unique.                                                                         |
| `module` | Name of the plugin module. Must be the same as the plugin folder name (case-sensitive)                                                         |
| `kinds`  | Array of values matching with this plugin. If the `kind` property of the incoming message is one of these, the plugin will handle the message. |
| `global` | Boolean value to make the plugin trigger on every message whatever the value of the `kind` property.                                           |

> If `kinds` is an empty array, the plugin will be loaded with a warning and will never be triggered. If you want a plugin to be triggered to every message, set `global` to `true`.
