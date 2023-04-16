import { CustomError } from './CustomError';

class AlreadyExist extends CustomError {
  statusCode = 403;

  constructor(resource: string) {
    super(`${resource}`);
    Object.setPrototypeOf(this, AlreadyExist.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export { AlreadyExist };
