const { createClient } = require ('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PSS,
    socket: {
        host: 'rainbow-set-disciplined-51084.db.redis.io',
        port: 17294
    }
});


module.exports = redisClient;
