import { CustomError } from './CustomError';

class BadRequestError extends CustomError {
  statusCode = 400;
  errors: string[];

  constructor(body: string, errors: string[]) {
    super(`invalid request body: ${body}`);
    this.errors = errors;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err };
    });
  }
}

export { BadRequestError };
