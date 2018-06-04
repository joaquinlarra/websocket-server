'use strict'

/* eslint-disable global-require */

const Path = require('path')
const Logger = require('./log')

const loadPlugin = (moduleName, server) => {
  let pluginClass
  try {
    const path = Path.join(process.cwd(), 'plugins', moduleName)
    pluginClass = require(path)
  } catch (err) {
    Logger.debug(`Error while loading plugin: ${err.stack}`)
    try {
      Logger.debug(`Looking for wizzy-${moduleName}-plugin...`)
      pluginClass = require(`wizzy-${moduleName}-plugin`)
    } catch (err) {
      Logger.warn(`Cannot find plugin: ${moduleName}. Skipping`)
      Logger.debug(`Error while loading plugin: ${err.stack}`)
    }
  }

  if (pluginClass) {
    return new pluginClass(server)
  }
  return null
}

module.exports = ({ debug = false, plugins = [], server = null }) => {
  return plugins
    .map((plugin) => {
      debug && Logger.debug(`[>] Looking for plugin: ${plugin.name}`)
      plugin.worker = loadPlugin(plugin.module, server)

      debug && !plugin.worker && Logger.warn(`[x] Cannot find suitable worker for plugin: ${plugin.name}`)
      debug && plugin.worker && Logger.debug(`[*] Plugin ${plugin.name} loaded.`)

      if (!plugin.worker) {
        return null
      }

      plugin.worker.setProperties({
        global : plugin.global,
        kinds : plugin.kinds,
        ...plugin.properties,
      })
      return plugin.worker
    })
    .filter((plugin) => plugin)
}
