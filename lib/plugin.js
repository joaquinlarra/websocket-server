'use strict'

/* eslint-disable global-require */

const Validator = require('./validator')
const { ValidationError } = require('./errors')

class WizzyPlugin {
  constructor() {
    this.schema = {}
  }

  validate(message) {
    return Validator.validate(message, this.schema)
  }

  work(ws, message) {
    const validationResult = this.validate(message)
    if (validationResult.errors.length) {
      throw new ValidationError(validationResult.errors)
    }
    return this._run(ws, message)
  }
}

module.exports = WizzyPlugin
