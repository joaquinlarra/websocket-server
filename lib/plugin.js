'use strict'

/* eslint-disable global-require */

const Validator = require('./validator')
const { ValidationError, UnknownPropertyError } = require('./errors')

class WizzyPlugin {
  constructor(server) {
    this.server = server
    this.schema = {}
    this.properties = {}
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

  setProperties(properties = {}) {
    this.properties = properties
  }

  setProperty(name, value) {
    this.properties[name] = value
  }

  removeProperty(name) {
    if (this.properties[name]) {
      delete this.properties[name]
    }
  }

  get(name) {
    if (!this.properties[name]) {
      throw new UnknownPropertyError(name)
    }
    return this.properties[name]
  }
}

module.exports = WizzyPlugin
