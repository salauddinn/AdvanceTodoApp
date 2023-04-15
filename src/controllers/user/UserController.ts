import { NextFunction, Response, Router } from 'express';
import { check, param, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import authMiddleware, { AuthenticatedRequest } from '../../middlewares/auth';
import { getUser, loginUser, saveUser } from './UserService';
import logger from '../../logger';

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
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        const { email, password } = req.body;
        try {
            const payload = await saveUser(email, password)
            jwt.sign(
                payload,
                'randomString',
                {
                    expiresIn: 10000,
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            logger.error(err);
            next(err);
        }
    }
);
/**
 * @method - GET
 * @param - /user/:id
 * @description - Get user details
 */
router.get('/user/:id', authMiddleware, [
    param('id').notEmpty().isMongoId()
], async (req: AuthenticatedRequest, res: Response,next:NextFunction) => {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await getUser(id)

        res.status(200).json(user);
    } catch (error) {
        logger.error(error);
        next(error);
    }
});
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
    async (req: AuthenticatedRequest, res: Response,next:NextFunction) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                });
            }

            const { email, password } = req.body;

            const payload = await loginUser(email, password);

            jwt.sign(
                payload,
                'randomString',
                {
                    expiresIn: '1h',
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token,
                    });
                }
            );
        } catch (error) {
            logger.error(error);
            next(error);
        }
    }
);


export { router as UserRouter };
