import sinon from 'sinon';
import { Request, Response } from 'express';
import { errorHandler, ErrorWithStatus } from '../errorHandler';
import { CustomError } from '../../errors';
import { ValidationError } from 'joi';

class TestCustomError extends CustomError {
  statusCode = 404;

  constructor() {
    super('error');
    Object.setPrototypeOf(this, TestCustomError.prototype);
  }

  serializeErrors() {
    return [{ message: 'customer test error' }];
  }
}

describe('Error Handler Middleware', () => {
  const badRequestErr: ErrorWithStatus = new Error('unknown');
  badRequestErr.statusCode = 400;

  const errors = [{ message: 'f1 empty', path: ['f1'], type: 'empty' }];
  const validationErr = new ValidationError('test error', errors, {});

  const tests = [
    {
      scenario: 'should return 500 if unknown error',
      error: new Error('unknown'),
      status: 500,
      messages: [{ message: 'An error occurred processing your request. Please try again.' }],
    },
    {
      scenario: 'should return 400 if bad request error',
      error: badRequestErr,
      status: 400,
      messages: [{ message: 'Invalid request body' }],
    },
    {
      scenario: 'should return validation errors if validation error',
      error: validationErr,
      status: 400,
      messages: [{ message: 'f1 empty' }],
    },
    {
      scenario: 'should return custom status if error is with custom status',
      error: new TestCustomError(),
      status: 404,
      messages: [{ message: 'customer test error' }],
    },
  ];
  tests.forEach((test) => {
    it(test.scenario, () => {
      const req = { body: {} } as Request;
      const { res, statusStub, sendStub } = mockResponse();
      const nextStub = sinon.stub();

      errorHandler(test.error, req, res, nextStub);

      sinon.assert.calledOnceWithExactly(statusStub, test.status);
      sinon.assert.calledOnceWithExactly(sendStub, {
        errors: test.messages,
      });
    });
  });

  const mockResponse = () => {
    const res = {} as Response;
    const statusStub = sinon.stub();
    const sendStub = sinon.stub();
    res.status = statusStub.returns(res);
    res.send = sendStub.returns(res);
    return { res, statusStub, sendStub };
  };
});
