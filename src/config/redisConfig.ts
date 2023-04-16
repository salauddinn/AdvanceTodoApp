import * as Redis from "redis";
import config from './serverConfig';
import logger from "../logger";

const url = config.REDIS_URL || 'redis://localhost:6379';

export const redisClient = Redis.createClient({url});

redisClient.on('error', (e) => {
    logger.error("error occurred estalibishing redis client",e)
})
redisClient.on('connect', () => {
    logger.info("Redis connection established")
})