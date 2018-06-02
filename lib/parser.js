'use strict'

const Moment = require('moment')
const Validator = require('./validator')
const {UnboundKindError, MalformedMessage} = require('./errors')

const generateErrorMessage = (err) => {
  const errorData = err.toJSON
    ? err.toJSON()
    : err.message
  return JSON.stringify({
    kind: 'error',
    moment: Moment
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss'),
    error: errorData
  })
}

module.exports = (ws, plugins) => {
  return async(message) => {
    try {
      /* Step 1 : Validate the message according to the basic mandatory schema */
      const instance = Validator.transform(message)
      if (!instance.kind) {
        throw new MalformedMessage()
      }
      /* Step 2 : Redirect the kind to the associated websocket plugin */
      const associatedPlugins = plugins.filter((plugin) => plugin.global || plugin.kinds.includes(instance.kind))
      if (!associatedPlugins.length) {
        throw new UnboundKindError(instance.kind)
      }
      /* Step 3 : Run the worker */
      return Promise.all(associatedPlugins.map(async(plugin) => {
        let workerResult = plugin
          .worker
          .work(ws, instance)
        if (workerResult instanceof Promise) {
          workerResult = await workerResult
        }
        return workerResult
      }))
    } catch (err) {
      console.error(err.stack)
      ws.send(generateErrorMessage(err))
    }
  }
}
