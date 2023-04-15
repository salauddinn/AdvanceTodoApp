import { NextFunction, Request, Response } from 'express';
import { MethodNotAllowedError } from '../errors/MethodNotAllowed';

const methodNotAllowedHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new MethodNotAllowedError(req.method, req.path));
};

export { methodNotAllowedHandler };
