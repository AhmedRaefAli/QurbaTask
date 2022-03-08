const jwt = require('jsonwebtoken');
const HttpError = require('./http-error');

module.exports = (req, res, next) => {
  if (req.user){
    return next(); //authenticated with google auth
  }
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1]; 
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, 'supersecret_dont_share');
    req.user = { _id: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed!', 403);
    return next(error);
  }
};
