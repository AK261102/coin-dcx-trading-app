const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // Default error response
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
  
    // Handle specific errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: err.errors,
      });
    }
  
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
    }
  
    // Handle CoinDCX API errors (custom error from coinDCXApi)
    if (err.message.startsWith('CoinDCX API Error')) {
      return res.status(502).json({
        success: false,
        message: err.message,
      });
    }
  
    // Generic error response
    res.status(status).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  };
  
  module.exports = errorHandler;