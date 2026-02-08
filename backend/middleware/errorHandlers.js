/**
 * Enhanced Error Handling Middleware
 * Handles 404, 500, and other HTTP errors with proper responses
 */

// 404 Error Handler - Must be placed AFTER all routes
const handle404 = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  
  // Log the 404 error
  console.log(`❌ 404 Error: ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  
  // Check if it's an API request
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'API endpoint not found',
      message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
      timestamp: new Date().toISOString()
    });
  }
  
  // For web requests, serve custom 404 page or redirect to home
  res.status(404).sendFile(path.join(__dirname, '../frontend/404.html'));
};

// Global Error Handler - Must be placed LAST
const handleErrors = (err, req, res, next) => {
  console.error('🚨 Server Error:', err.stack);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  // API error response
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(status).json({
      success: false,
      error: status === 500 ? 'Internal Server Error' : message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      timestamp: new Date().toISOString()
    });
  }
  
  // Web error response
  if (status === 500) {
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Server Error - EcoLife</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
          .error-container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          h1 { color: #e74c3c; margin-bottom: 20px; }
          p { color: #666; margin-bottom: 30px; }
          .btn { background: #27ae60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
          .btn:hover { background: #2ecc71; }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>🚨 Server Error</h1>
          <p>Something went wrong on our end. We're working to fix it!</p>
          <a href="/" class="btn">🏠 Go Home</a>
        </div>
      </body>
      </html>
    `);
  } else {
    res.status(status).redirect('/');
  }
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  handle404,
  handleErrors,
  asyncHandler
};