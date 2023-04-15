import { CustomError } from './CustomError';

class InvalidToken extends CustomError {
  statusCode = 400;

  constructor(resource: string) {
    super(`${resource} not found`);
    Object.setPrototypeOf(this, InvalidToken.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export { InvalidToken };
