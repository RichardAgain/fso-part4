const { response } = require("../app")

const errorHandler = (error, req, res, next) => {
  switch (error.name) {
    case "JsonWebTokenError":
      return res.status(401).json({ error: "Invalid token" })
    case "TokenExpiredError":
      return res.status(401).json({ error: "Token Expired" })
    case "ValidationError":
      return res.status(400).json({ error: error.message })
  }

  return response.status(400)
}

module.exports = errorHandler
