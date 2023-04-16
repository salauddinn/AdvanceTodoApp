import * as Redis from "redis";
import config from './serverConfig';
import logger from "../logger";

const url = config.REDIS_URL || 'redis://localhost:6379';

export const redisClient = Redis.createClient();

redisClient.on('error', () => {
    logger.error("error occurred estalibishing redis client")
})
redisClient.on('connect', () => {
    logger.error("Redis connection established")
})