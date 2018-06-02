'use strict'

const Moment = require('moment')
const Validator = require('./validator')
const loadPlugins = require('./plugin-loader')
const { UnboundKindError, MalformedMessage } = require('./errors')

const plugins = loadPlugins({ debug : process.env.NODE_ENV !== 'production' })

const generateErrorMessage = (err) => {
  const errorData = err.toJSON ? err.toJSON() : err.message
  return JSON.stringify({
    kind : 'error',
    moment : Moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
    error : errorData,
  })
}

module.exports = (ws) => {
  return async (message) => {
    try {
      /* Step 1 : Validate the message according to the basic mandatory schema */
      const instance = Validator.transform(message)
      if (!instance.kind) {
        throw new MalformedMessage()
      }
      /* Step 2 : Redirect the kind to the associated websocket plugin */
      const associatedPlugin = plugins.find((plugin) => plugin.kinds.includes(instance.kind))
      if (!associatedPlugin) {
        throw new UnboundKindError(instance.kind)
      }
      /* Step 3 : Run the worker */
      let workerResult = associatedPlugin.worker.work(ws, instance)
      if (workerResult instanceof Promise) {
        workerResult = await workerResult
      }
      return workerResult
    } catch (err) {
      console.error(err.stack)
      ws.send(generateErrorMessage(err))
    }
  }
}
