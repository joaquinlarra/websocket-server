'use strict'

const Validator = require('jsonschema').Validator
const validator = new Validator({
  throwError : true,
})

const kindSchema = {
  type : 'string',
  minLength : 3,
  maxLength : 16,
}

module.exports = {
  transform : (message) => {
    return JSON.parse(message)
  },
  validate : (message, schema) => {
    if (schema.type === 'object') {
      schema.properties.kind = kindSchema
    }
    return validator.validate(message, schema)
  },
}
