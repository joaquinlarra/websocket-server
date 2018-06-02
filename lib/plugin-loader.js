'use strict'

/* eslint-disable global-require */

const Path = require('path')
const Config = require('config')

const loadPlugin = (moduleName) => {
  let pluginClass
  try {
    pluginClass = require(Path.join(process.cwd(), 'plugins', moduleName))
  } catch (err) {
    try {
      pluginClass = require(`wizzy-${moduleName}-plugin`)
    } catch (err) {
      console.warn(`Cannot find plugin: ${moduleName}. Skipping`)
    }
  }

  if (pluginClass) {
    return new pluginClass()
  }
  return null
}

module.exports = ({
  debug = false,
  plugins = []
}) => {
  return plugins.map((plugin) => {
    debug && console.log(`[>] Looking for plugin: ${plugin.name}`)
    plugin.worker = loadPlugin(plugin.module)
    debug && !plugin.worker && console.warn(`[x] Cannot find suitable worker for plugin: ${plugin.name}`)
    debug && plugin.worker && console.log(`[*] Plugin ${plugin.name} loaded.`)
    return plugin.worker
      ? plugin
      : null
  }).filter((plugin) => plugin)
}
