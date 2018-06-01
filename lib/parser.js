'use strict'

/* eslint-disable global-require */

const Config = require('config')
const Moment = require('moment')
const Validator = require('./validator')()
const { ValidationError, UnboundKindError, UnknownPluginError } = require('./errors')

const generateErrorMessage = (err) => {
  const errorData = err.toJSON ? err.toJSON() : err.message
  return JSON.stringify({
    kind : 'error',
    moment : Moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
    error : errorData,
  })
}

module.exports = (ws) => {
  return (message) => {
    try {
      /* Step 1 : Validate the message according to the schema */
      const validationResult = Validator.validate(message)
      if (validationResult.errors.length) {
        throw new ValidationError(validationResult.errors)
      }
      /* Step 2 : Redirect the kind to the associated websocket plugin */
      const plugins = Config.get('plugins').filter((plugin) => plugin.kinds.includes(validationResult.instance.kind))
      if (!plugins.length) {
        throw new UnboundKindError(validationResult.instance.kind)
      }
      for (const plugin of plugins) {
        try {
          require(`../plugins/${plugin.module}`)(ws, validationResult.instance)
        } catch (err) {
          try {
            require(`wizzy-${plugin.module}-plugin`)(ws, validationResult.instance)
          } catch (err) {
            console.warn(`Cannot find plugin ${plugin.module}. Skipping.`)
            throw new UnknownPluginError(plugin.module)
          }
        }
      }
    } catch (err) {
      console.error(err.stack)
      ws.send(generateErrorMessage(err))
    }
  }
}
