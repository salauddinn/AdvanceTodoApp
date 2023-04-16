import { NextFunction, Response, Router } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { getUser, loginUser, saveUser } from './UserService';
import logger from '../../logger';
import { redisClient } from '../../config/redisConfig';

const router = Router();


export const createNewUserHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    const { email, password } = req.body;
    try {
        const payload = await saveUser(email, password)
        const [accessToken, refreshToken] = getAccessTokenAndRefreshToken(payload);

        res.status(200).json({
            accessToken, refreshToken, payload
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

export const getUserHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await getUser(id)
        redisClient.setEx(req.originalUrl, 300, JSON.stringify(user));

        res.status(200).json(user);
    } catch (error) {
        logger.error(error);
        next(error);
    }
}
export const loginUserHandler =
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                });
            }

            const { email, password } = req.body;

            const payload = await loginUser(email, password);

            const [accessToken, refreshToken] = getAccessTokenAndRefreshToken(payload);

            res.status(200).json({
                accessToken, refreshToken
            });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    }

const getAccessTokenAndRefreshToken = (payload: { user: { id: any; }; }) => {
    const accessToken = jwt.sign(
        payload,
        'TodoApp',
        {
            expiresIn: '1h',
        }
    );
    const refreshToken = jwt.sign(
        { userId: payload.user.id },
        'TodoAppRefreshToken',
        {
            expiresIn: '7d',
        }
    );
    redisClient.setEx(`refreshToken${payload.user.id}`, 7 * 24 * 60 * 60, refreshToken);

    return [accessToken, refreshToken];
}
export const logoutUserHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        redisClient.del(`refreshToken${userId}`)

        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        logger.error(error);
        next(error);
    }
}


export { router as UserRouter };


