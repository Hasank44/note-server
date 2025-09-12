const jwtToken = require('jsonwebtoken');

const verifyToken = (authHeader, secret) => {
  return new Promise((resolve, reject) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reject({
        status: 401,
        message: 'Authorization header missing or invalid'
      });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return reject({
        status: 401,
        message: 'Token missing'
      });
    }
    try {
      const decoded = jwtToken.verify(token, secret);
      resolve(decoded);
    } catch (err) {
      reject({
        status: 401,
        message: 'Invalid or expired token'
      });
    }
  });
};

module.exports = verifyToken;