import { NextFunction, Response, Router } from 'express';
import { check, param, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import authMiddleware, { AuthenticatedRequest } from '../../middlewares/auth';
import { getUser, loginUser, saveUser } from './UserService';
import logger from '../../logger';
import { redisClient } from '../../config/redisConfig';
import { cacheMiddleware } from '../../middlewares/cache';
import { createNewUserHandler, getUserHandler, loginUserHandler, logoutUserHandler } from './UserHandler';

const router = Router();


/**
 * @method - POST
 * @param - /user
 * @description - Create new user
 */

router.post(
    '/user',
    [
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a valid password').isLength({
            min: 6,
        }),
    ],
    createNewUserHandler
);
/**
 * @method - GET
 * @param - /user/:id
 * @description - Get user details
 */
router.get('/user/:id', authMiddleware, cacheMiddleware, [
    param('id').notEmpty().isMongoId()
], getUserHandler);
/**
 * @method - POST
 * @param - /login/
 * @description - Login the user
 */

router.post(
    '/login',
    [
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a valid password').isLength({
            min: 6,
        }),
    ],
    loginUserHandler
);

/**
 * @method - POST
 * @param - /logout
 * @description - Logout the user
 */
router.post('/logout', authMiddleware, logoutUserHandler);


export { router as UserRouter };


