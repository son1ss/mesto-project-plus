import { CelebrateError, isCelebrateError } from "celebrate";
import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "types/errors";

export const errorHandler = (
  error: Error | CelebrateError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode || 500;

  if (
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError ||
    error instanceof BadRequestError
  ) {
    statusCode = error.statusCode;
  } else if (isCelebrateError(error)) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    message: error.message,
  });
};
