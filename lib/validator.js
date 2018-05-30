'use strict'

const Config = require('config')
const Validator = require('jsonschema').Validator
const Yaml = require('js-yaml')
const Fs = require('fs')
const Path = require('path')
const validator = new Validator()
const defaultSchemasDir = Path.resolve(__dirname, '../schemas')
const schemasDir = Config.get('schemasDir')

function schemaFileExists(path, file) {
  try {
    const stat = Fs.statSync(Path.join(path, file))
    return true
  } catch (err) {
    return false
  }
}

function readSchemaFile(path) {
  try {
    const schema = Yaml.safeLoad(Fs.readFileSync(path))
    if (schema.dependencies) {
      for (const dependency of schema.dependencies) {
        const depPath = [schemasDir, defaultSchemasDir].find((dir) => schemaFileExists(dir, dependency))
        if (!depPath) {
          readSchemaFile(Path.join(depPath, `${dependency}.yml`))
        }
      }
    }
    if (schema.atomic) {
      validator.addSchema(schema.schema, schema.schema.id)
    }
  } catch (err) {
    console.warn(`Cannot read schema file ${path}`)
  }
}

if (schemaFileExists(schemasDir, 'default')) {
  readSchemaFile(Path.join(schemasDir, 'default.yml'))
} else if (schemaFileExists(defaultSchemasDir, 'default')) {
  readSchemaFile(Path.join(defaultSchemasDir, 'default.yml'))
} else {
  throw new Error('Cannot Read default schema for message decoding. Aborting.')
}

module.exports = {
  validate : (message) => {
    try {
      const mObj = JSON.parse(message)
      for (const schema of schemas) {
        console.log(validator.validate())
      }
    } catch (err) {

    }
  }
}
