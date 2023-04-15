import { Router, Response } from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../models/UserModal';
import { AuthenticatedRequest } from '../../middlewares/auth';

const router = Router();
/**
 * @method - POST
 * @param - /login
 * @description - login existing user
 */


export { router as LoginRouter };
