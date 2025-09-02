const Redis = require('ioredis');
const genericPool = require('generic-pool');

const factory = {
    create: () => {
        return new Redis({
        //host: '84.247.187.83',
        host: '127.0.0.1',
        port: 6380
        });
    },
    destroy: (client) => {
        client.quit();
    }
};

  const opts = {
    max: 100, // Maximum number of clients in the pool
    min: 2   // Minimum number of clients in the pool
  };

const connectToRedis = genericPool.createPool(factory, opts);

module.exports = {
    connectToRedis,
};
