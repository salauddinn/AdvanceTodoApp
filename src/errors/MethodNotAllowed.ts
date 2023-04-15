import { CustomError } from './CustomError';

class MethodNotAllowedError extends CustomError {
  statusCode = 405;

  constructor(method: string, path: string) {
    super(`method ${method} not allowed for api path ${path}`);
    Object.setPrototypeOf(this, MethodNotAllowedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'method not allowed' }];
  }
}

export { MethodNotAllowedError };
