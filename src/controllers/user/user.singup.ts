import bcrypt from 'bcrypt';
import { Response, Router } from 'express';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { User } from '../../models/UserModal';

const router = Router();

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

export { router as SignupRouter };
