import { Router } from 'express';
import { check, param } from 'express-validator';
import authMiddleware from '../../middlewares/auth';
import { cacheMiddleware } from '../../middlewares/cache';
import { createNewUserHandler, getUserHandler, loginUserHandler, logoutUserHandler } from './UserHandler';

const router = Router();

/**
 *@openapi
 * tags:
 *   name: User
 *   description: User management APIs
 */

/**
 * @openapi
 * /user:
 *   post:
 *     summary: Create new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
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
 * @openapi
 * /user/{id}:
 *   get:
 *     summary: Get user details
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           format: ObjectId
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
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
 * @openapi
 * /login:
 *   post:
 *     summary: Login the user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post('/logout', authMiddleware, logoutUserHandler);


export { router as UserRouter };


