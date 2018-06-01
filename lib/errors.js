'use strict'

class WizzyError extends Error {
  constructor(code, detail, message) {
    super(message)
    this.code = code
    this.detail = detail
  }
  toJSON() {
    return {
      detail : this.detail,
      code : this.code,
      message : this.message,
    }
  }
  toString() {
    return JSON.stringify(this.toJSON())
  }
}

class ValidationError extends WizzyError {
  constructor(errors = []) {
    super('WE-01', errors, `Cannot validate incoming message: ${errors.join('\n')}`)
  }
}

class UnboundKindError extends Error {
  constructor(kind) {
    super('WE-02', kind, `Cannot find suitable plugin for kind: ${kind}`)
  }
}

class UnknownPluginError extends Error {
  constructor(plugin) {
    super('WE-03', plugin, `Cannot find plugin: ${plugin}`)
  }
}

module.exports = {
  ValidationError,
  UnboundKindError,
  UnknownPluginError,
}
