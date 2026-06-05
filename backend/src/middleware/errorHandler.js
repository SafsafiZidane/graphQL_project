function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (res.headersSent) {
    return next(err);
  }

  res.status(status).json({
    error: {
      message,
      details: err.details || null,
    },
  });
}

module.exports = errorHandler;
