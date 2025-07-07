const jwt = require('jsonwebtoken'); // Used to verify JWT tokens

// This middleware checks if a request has a valid authentication token
module.exports = (req, res, next) => {
  // Get the "Authorization" header from the request (e.g. "Bearer abc123...")
  const authHeader = req.get('Authorization');
  console.log('Authorization header:', authHeader); 

  // If there is no Authorization header, the user is not authenticated
  if (!authHeader) {
    req.isAuth = false;
    return next(); // Move on to the next middleware or route handler
  }

  // Extract the token part (after "Bearer ")
  const token = authHeader.split(' ')[1]; // Splits into ["Bearer", "token"]
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }

  let decodedToken;
  try {
    // Verify the token using the secret key
    decodedToken = jwt.verify(token, 'somesupersecretkey');
  } catch (err) {
    // If token is invalid or expired, authentication fails
    req.isAuth = false;
    return next();
  }

  // If decoding failed or token is malformed
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  // If everything is valid, set auth flags on the request
  req.isAuth = true;
  req.userId = decodedToken.userId; // Attach userId to request for use later

  next(); // Proceed to the next middleware or route
};
