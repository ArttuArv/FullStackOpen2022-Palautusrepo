const logger = require('./logger')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

// JWT generator and middlewares
const generateToken = (user) => {
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  return jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: '30min' })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

const userExtractor = (request, response, next) => {
  if (request.token) {
    jwt.verify(request.token, process.env.SECRET, (error, decoded) => {
      if (error) {
        return response.status(401).json({ error: 'invalid token' })
      } else {
        request.user = decoded
      }
    })
  }
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  generateToken,
  tokenExtractor,
  userExtractor,
}