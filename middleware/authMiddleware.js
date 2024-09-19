const jwt = require('jsonwebtoken')

const getRequestToken = (req, res, next) => {
  const authorization = req.get("authorization")
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "")
  }

  next()
}

const getRequestUser = (req, res, next) => {
  req.user = jwt.verify(req.token, process.env.SECRET_KEY)
  next()
}

module.exports = { getRequestToken, getRequestUser }
