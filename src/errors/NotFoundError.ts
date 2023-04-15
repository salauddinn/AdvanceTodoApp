import { CustomError } from './CustomError';

class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(resource: string) {
    super(`${resource} not found`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export { NotFoundError };
