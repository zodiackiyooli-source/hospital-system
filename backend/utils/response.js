// ErrorResponse class for consistent errors (used in errorMiddleware)
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Success response formatter
const successResponse = (res, statusCode = 200, data, message = 'Success') => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

module.exports = { ErrorResponse, successResponse };

