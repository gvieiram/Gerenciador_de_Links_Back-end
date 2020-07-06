require('dotenv').config();
const jwt = require('jsonwebtoken');

const tokenPrivateKey = process.env.JWT_TOKEN_PRIVATE_KEY;
const refreshTokenPrivateKey = process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY;

const options = { expiresIn: '30 minutes' };
const RefreshOptions = { expiresIn: '30 days' };

const genarateJwt = (payload) => {
return jwt.sign(payload, tokenPrivateKey, options);
};

const genarateRefreshJwt = (payload) => {
return jwt.sign(payload, refreshTokenPrivateKey, RefreshOptions);
};

const verifyJwt = (token) => {
  return jwt.verify(token, tokenPrivateKey);
};

const verifyRefreshJwt = (token) => {
  return jwt.verify(token, refreshTokenPrivateKey);
};

module.exports = {genarateJwt, genarateRefreshJwt, verifyJwt, verifyRefreshJwt};