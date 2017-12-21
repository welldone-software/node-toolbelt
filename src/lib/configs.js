const {mapValues} = require('lodash')
const dotevn = require('dotenv')

dotevn.config()

const mapEnv = defaults =>
    mapValues(defaults, (val, key) => process.env[key] || val)

const assignEnv = defaults => Object.assign(defaults, mapEnv(defaults))

module.exports = {
  mapEnv,
  assignEnv
}
