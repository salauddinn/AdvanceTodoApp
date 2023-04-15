import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors';
import { ValidationError } from 'joi';
import logger from '../logger';

export type ErrorWithStatus = Error & { status?: number; statusCode?: number };

const errorHandler = (err: ErrorWithStatus, _req: Request, res: Response, _: NextFunction) => {
  const status: number = getStatusCode(err);
  logError(status, err);

  if (err instanceof CustomError) {
    return res.status(status).send({ errors: err.serializeErrors() });
  }

  if (err instanceof ValidationError) {
    return res.status(status).send({
      errors: err.details.map((err) => {
        return { message: err.message };
      }),
    });
  }

  if (status === 400) {
    return res.status(status).send({ errors: [{ message: 'Invalid request body' }] });
  }

  res.status(status).send({
    errors: [{ message: 'An error occurred processing your request. Please try again.' }],
  });
};
const getStatusCode = (err: ErrorWithStatus) => {
  if (err instanceof ValidationError) {
    return 400;
  }
  return err.status ?? err.statusCode ?? 500;
};

const logError = (status: number, err: ErrorWithStatus) => {
  const isClientErrCode = status >= 400 && status <= 499;
  if (isClientErrCode) {
    logger.warn('client error ', { msg: err.message, err });
    return;
  }
  logger.error(err);
};

export { errorHandler };
