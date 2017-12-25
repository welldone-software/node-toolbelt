const {mapValues, map, snakeCase} = require('lodash')
const dotevn = require('dotenv')

dotevn.config()

const mapEnv = defaults =>
  mapValues(defaults, (val, key) => process.env[key] || val)

const assignEnv = defaults => Object.assign(defaults, mapEnv(defaults))

const deepMapEnv = (obj, basePath = '') => {
  const fn = obj instanceof Array ? map : mapValues
  return fn(obj, (val, key) => {
    const envKey = `${basePath ? `${basePath}__` : ''}${snakeCase(key).toUpperCase()}`
    return process.env[envKey] || (typeof val === 'object' ? deepMapEnv(val, envKey) : val)
  })
}

module.exports = {
  assignEnv,
  mapEnv,
  deepMapEnv,
}
