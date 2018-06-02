'use strict'

module.exports = (fn) => {
  return async (...args) => {
    const result = fn(...args)
    if (result instanceof Promise) {
      return await result
    }
    return result
  }
}
