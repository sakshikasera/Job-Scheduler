const redis = require('redis');

// Create a Redis client instance
// By default, it connects to localhost:6379
const client = redis.createClient();

// Listen for connection errors and log them
client.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

// Attempt to connect to the Redis server
client.connect()
  .then(() => {
    console.log('✅ Connected to Redis');
  });

// Export the connected Redis client so it can be used elsewhere in the app
module.exports = client;
