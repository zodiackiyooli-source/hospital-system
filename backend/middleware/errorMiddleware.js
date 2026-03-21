const { ErrorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  // Log full error for debugging in BOTH terminal and Winston
  console.error('\n❌ --- [API CRASH DEBUG] ---');
  console.error(`Method: ${req.method} | URL: ${req.originalUrl}`);
  console.error(`Error Name: ${err.name}`);
  console.error(`Error Message: ${err.message}`);
  if (err.stack) console.error(`Stack: ${err.stack}`);
  console.error('---------------------------\n');

  let error = { ...err };
  error.message = err.message || (typeof err === 'string' ? err : 'Server Error');

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'JSON Web Token is invalid';
    error = new ErrorResponse(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'JSON Web Token is expired';
    error = new ErrorResponse(message, 401);
  }

  const statusCode = error.statusCode || err.statusCode || 500;
  const message = error.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });
};


module.exports = errorHandler;


