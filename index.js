'use strict'

const WizzyServer = require('./lib/server')

if (module.parent) {
  module.exports = WizzyServer
} else {
  new WizzyServer({
    plugins : [
      {
        name : 'Hello World',
        module : 'hello-world',
        kinds : ['hello'],
      },
    ],
  }).start()
}
