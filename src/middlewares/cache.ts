import { Request, Response, NextFunction } from 'express';
import { redisClient } from "../config/redisConfig";
import logger from "../logger";

export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const key = req.originalUrl || req.url;
    try {
        const data = await redisClient.get(key);
        if (data != null) {
            logger.info("Found it in Redis 🟢"+ key);
            res.json(JSON.parse(data));
        } else {
            logger.info("User Not Found 🔴 ");
            next();
        }
    }
    catch (err) {
        next(err);
    }
};
