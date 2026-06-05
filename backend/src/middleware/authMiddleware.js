const jwt = require('jsonwebtoken');
const config = require('../config');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  } catch (error) {
    req.user = null;
  }

  return next();
}

module.exports = authMiddleware;
