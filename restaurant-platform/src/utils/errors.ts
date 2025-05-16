// Custom error classes
export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthError';
  }
}

export class ValidationError extends Error {
  constructor(message: string = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Error mapping
export const errorMap = {
  400: ValidationError,
  401: AuthError,
  404: NotFoundError,
  500: NetworkError,
};

// User-friendly error messages
export const userFriendlyMessages: Record<string, string> = {
  NetworkError: 'Unable to connect to the server. Please check your internet connection.',
  AuthError: 'Your session has expired. Please log in again.',
  ValidationError: 'Please check your input and try again.',
  NotFoundError: 'The requested resource was not found.',
};

// Error logger
export const logError = (error: Error, context?: any) => {
  console.error({
    name: error.name,
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
  // Here you could send to your error tracking service (e.g., Sentry)
}; 