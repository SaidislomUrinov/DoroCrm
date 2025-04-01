import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => console.error('Redis error:', err));

const connectRedis = async () => {
    try {
        if (!client.isOpen) {
            await client.connect();
            console.log('Redis connected');
        }
    } catch (error) {
        console.error('Redis error', error);
    }
};

export { client, connectRedis };
