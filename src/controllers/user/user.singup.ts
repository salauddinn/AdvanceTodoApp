import bcrypt from 'bcrypt';
import { Response, Router } from 'express';
import { check, param, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import authMiddleware, { AuthenticatedRequest } from '../../middlewares/auth';
import { User } from '../../models/UserModal';

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
    async (req: AuthenticatedRequest, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({
                email,
            });
            if (user) {
                return res.status(400).json({
                    msg: 'User Already Exists',
                });
            }

            user = new User({
                email,
                password,
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                },
            };
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
            console.log(err.message);
            res.status(500).send('Error in Saving');
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
], async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                });
            }

            const { email, password } = req.body;

            const user = await User.findOne({
                email,
            });

            if (!user) {
                return res.status(400).json({
                    message: 'Requested User does not exist',
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    message: 'Incorrect Password !',
                });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

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
            console.error(error.message);
            res.status(500).json({
                message: 'Server Error',
            });
        }
    }
);


export { router as SignupRouter };
