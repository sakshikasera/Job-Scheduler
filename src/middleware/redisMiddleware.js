// Import the initialized Redis client
const redisClient = require('../redisClient');

// Middleware to attach Redis client to every incoming request
const attachRedis = (req, res, next) => {
  // Make Redis available in the request object (req.redis)
  // So that controllers can use it to get/set cache easily
  req.redis = redisClient;

  // Move to the next middleware or route handler
  next();
};

// Export the middleware so it can be used in the app
module.exports = attachRedis;
