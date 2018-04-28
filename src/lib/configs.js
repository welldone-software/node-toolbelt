const {mapValues, map, snakeCase, merge} = require('lodash')
const dotevn = require('dotenv')

dotevn.config()

const mapEnv = (obj, basePath = '') => {
  const fn = obj instanceof Array ? map : mapValues
  return fn(obj, (val, key) => {
    const envKey =
      `${basePath ? `${basePath}__` : ''}${snakeCase(key).toUpperCase()}`
    return (
      process.env[envKey] ||
      (typeof val === 'object' ? mapEnv(val, envKey) : val)
    )
  })
}

const getEnvKeys = (obj, basePath = '') => Object.keys(mapEnv(obj, basePath))

const mergeEnv = (obj, basePath = '') => merge(obj, mapEnv(obj, basePath))


module.exports = {
  mapEnv,
  mergeEnv,
  getEnvKeys,
}
