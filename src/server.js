// Load environment variables from .env file
require('dotenv').config();

// Import the Express app instance from app.js
const app = require('./app');

// Import Redis middleware to attach the Redis client to each request
const attachRedis = require('./middleware/redisMiddleware');

// Use the Redis middleware globally across all routes
app.use(attachRedis);

// Set the port for the server (from environment or default to 5000)
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
