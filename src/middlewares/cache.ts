import { Request, Response, NextFunction } from 'express';
import { redisClient } from "../config/redisConfig";
import logger from "../logger";

export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const data = await redisClient.get(id);
        if (data != null) {
            logger.info("Found it in Redis  sjdj🟢");
        } else {
            logger.info("User Not Found 🔴 ");
            next();
        }
    }
    catch (err) {
        next(err);
    }
};
