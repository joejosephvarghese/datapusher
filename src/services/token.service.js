
const jwt = require('jsonwebtoken');
const {jwtConfig}=require('../config/config')

const generateToken = (userId, expires, type, secret = jwtConfig.jwt) => {
    const payload = {
      sub: userId,
      // iat: moment().unix(),
  
      type: 'User',
    };
    return jwt.sign(payload, secret);
  };


  module.exports = {
    generateToken,

  };
  