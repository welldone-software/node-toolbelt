const {mapValues} = require('lodash')
const dotevn = require('dotenv')

const envConfig = dotevn.config()

const mapEnv = defaults =>
  mapValues(envConfig.parsed, (val, key) => process.env[key] || defaults[key])

const assignEnv = defaults => Object.assign({}, defaults, mapEnv(defaults))

module.exports = {
  assignEnv,
}
