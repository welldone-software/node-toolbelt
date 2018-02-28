const {createMiddleware} = require('./expressHelpers')
const jsonWebToken = require('jsonwebtoken')
const {
  AuthorizationError,
  AuthenticationError,
  NotFoundError,
  UnexpectedError,
} = require('./exceptions')
const expressJwt = require('express-jwt')

const verify = (token, jwtSecret) => jsonWebToken.verify(token, jwtSecret)

const generateToken = (jwtSecret, payload, expiresIn) =>
  jsonWebToken.sign(payload, jwtSecret, {expiresIn})

const jwtRequest = jwtSecret =>
  expressJwt({
    secret: jwtSecret,
    userProperty: 'jwt',
    credentialsRequired: false,
  })

const defaultOptions = {
  shouldBeVerified: true,
  findUser: undefined,
  shouldAddUserToRequest: false,
  roles: [],
}

const jwtSecure = (options = defaultOptions) => {
  const opts = {...defaultOptions, ...options}
  return createMiddleware(async (req) => {
    const {jwt} = req
    if (!jwt || !jwt.userId || (opts.shouldBeVerified && !jwt.verified)) {
      throw new AuthenticationError('jwt token not valid', {jwt})
    }
    if (opts.shouldAddUserToRequest || opts.roles.length) {
      if (!opts.findUser) {
        throw new UnexpectedError('Find user function is undefined')
      }
      const user = await opts.findUser({id: jwt.userId})
      if (!user) {
        throw new NotFoundError('User not found', {userId: jwt.userId})
      }
      if (opts.shouldAddUserToRequest) {
        req.userData = user.dataValues
      }
      if (opts.roles.length) {
        const isAutherized = opts.roles.every(role => user.roles.includes(role))
        if (!isAutherized) {
          throw new AuthorizationError(
            'User not autherize to role',
            {userId: jwt.userId, roles: opts.roles}
          )
        }
      }
    }
  })
}

module.exports = {
  jwtRequest,
  jwtSecure,
  generateToken,
  verify,
}
