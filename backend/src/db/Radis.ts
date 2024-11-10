import { createClient } from 'redis';

const client = createClient({
    password: 'A8DAqAlHCPU5fwYbYfi36uIlKJDjolqS',
    socket: {
        host: 'redis-12113.c292.ap-southeast-1-1.ec2.redns.redis-cloud.com',
        port: 12113
    }
});
client.on("connect", ()=>{
    console.log('Connected to Redis');
})
client.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  const connectRedis = async () => {
    try {
      await client.connect();
      console.log('Redis client connected');
    } catch (err) {
      console.error('Could not establish a connection with Redis:', err);
    }
  };
  connectRedis()


export default client
