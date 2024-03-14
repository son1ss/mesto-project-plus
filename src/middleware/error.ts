import { CelebrateError, isCelebrateError } from 'celebrate';
import { NextFunction, Request, Response } from 'express';
import { MongoError } from 'mongodb';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from 'types/errors';

export const errorHandler = (
  error: Error | CelebrateError | MongoError,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode || 500;

  if (
    error instanceof NotFoundError
    || error instanceof UnauthorizedError
    || error instanceof BadRequestError
    || error instanceof ForbiddenError
  ) {
    statusCode = error.statusCode;
  } else if (isCelebrateError(error)) {
    statusCode = 400;
  } else if (error instanceof MongoError && error.code === 11000) {
    statusCode = 409;
  }

  res.status(statusCode).json({
    message: error.message,
  });

  next();
};
