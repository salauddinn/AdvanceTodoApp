import { Router, Response } from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../models/UserModal';
import { AuthenticatedRequest } from '../../middlewares/auth';

const router = Router();

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

export { router as LoginRouter };
