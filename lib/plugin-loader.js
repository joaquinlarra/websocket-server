'use strict'

/* eslint-disable global-require */

const Path = require('path')
const Logger = require('./log')

const loadPlugin = (moduleName) => {
  let pluginClass
  try {
    pluginClass = require(Path.join(process.cwd(), 'plugins', moduleName))
  } catch (err) {
    try {
      pluginClass = require(`wizzy-${moduleName}-plugin`)
    } catch (err) {
      Logger.warn(`Cannot find plugin: ${moduleName}. Skipping`)
    }
  }

  if (pluginClass) {
    return new pluginClass()
  }
  return null
}

module.exports = ({ debug = false, plugins = [] }) => {
  return plugins
    .map((plugin) => {
      debug && Logger.debug(`[>] Looking for plugin: ${plugin.name}`)
      plugin.worker = loadPlugin(plugin.module)

      debug && !plugin.worker && Logger.warn(`[x] Cannot find suitable worker for plugin: ${plugin.name}`)
      debug && plugin.worker && Logger.debug(`[*] Plugin ${plugin.name} loaded.`)

      plugin.worker.setProperties(plugin.properties)
      return plugin.worker ? plugin : null
    })
    .filter((plugin) => plugin)
}
