'use strict'

const Config = require('config')
const Validator = require('jsonschema').Validator
const Yaml = require('js-yaml')
const Fs = require('fs')
const Path = require('path')
const validator = new Validator({
  throwError : true,
})
const defaultSchemasDir = Path.resolve(__dirname, '../schemas')
const schemasDir = Config.has('schemasDir') ? Config.get('schemasDir') : null

function schemaFileExists(path, file) {
  try {
    Fs.accessSync(Path.join(path, file), Fs.constants.R_OK)
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
        const depPath = [schemasDir, defaultSchemasDir].find((dir) => (dir ? schemaFileExists(dir, `${dependency}.yml`) : false))
        if (depPath) {
          readSchemaFile(Path.join(depPath, `${dependency}.yml`))
        }
      }
    }
    if (schema.atomic) {
      validator.addSchema(schema.schema, schema.schema.id)
    }
    return schema.schema
  } catch (err) {
    console.warn(`Cannot read schema file ${path}: ${err}`)
    throw err
  }
}

function readDefaultSchema() {
  const defaultName = 'default.yml'
  if (schemaFileExists(schemasDir, defaultName)) {
    return readSchemaFile(Path.join(schemasDir, defaultName))
  } else if (schemaFileExists(defaultSchemasDir, defaultName)) {
    return readSchemaFile(Path.join(defaultSchemasDir, defaultName))
  }
  throw new Error('Cannot Read default schema for message decoding. Aborting.')
}

module.exports = () => {
  const defaultSchema = readDefaultSchema()
  return {
    validate : (message) => {
      const mObj = JSON.parse(message)
      return validator.validate(mObj, defaultSchema)
    },
  }
}
