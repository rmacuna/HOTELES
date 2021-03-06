const jwt = require('jsonwebtoken');
const logger = require('winston');

const config = require('./../../config');

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        const message = 'Unauthorized';
        logger.warn(message);
        res.status(401);
        res.json({
          success: false,
          message,
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    const message = 'Forbidden Token';
    logger.warn(message);
    res.status(403);
    res.json({
      success: false,
      message,
    });
  }
};

const signToken = (payload) => jwt.sign(payload, config.jwt.secret, {
  algorithm: 'HS256'
});

const authFailed = (req, res, next) => {
  res.json({
    success: false,
    message: 'Email or password does not match',
  });
};

module.exports = {
  auth,
  authFailed,
  signToken
};