// Error Handler Utility
// Path: lib/error-handler.js

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

export function handleError(error, defaultMessage = 'Internal server error') {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      statusCode: error.statusCode,
    };
  }

  // Handle Supabase errors
  if (error.code === '23505') {
    return {
      success: false,
      error: 'This resource already exists',
      statusCode: 409,
    };
  }

  if (error.code === '23503') {
    return {
      success: false,
      error: 'Invalid reference or foreign key',
      statusCode: 400,
    };
  }

  return {
    success: false,
    error: error.message || defaultMessage,
    statusCode: 500,
  };
}
