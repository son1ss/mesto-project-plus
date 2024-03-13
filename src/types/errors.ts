export class NotFoundError extends Error {
  statusCode: number;

  constructor(message = 'Not Found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

export class BadRequestError extends Error {
  statusCode: number;

  constructor(message = 'Bad Request') {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message = 'Недостаточно прав') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}
