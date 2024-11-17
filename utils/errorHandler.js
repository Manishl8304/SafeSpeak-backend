exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Undefined Error";
  res.status(err.statusCode).json({
    Status: err.status,
    Message: err.message,
  });
};

// module.exports = errorhandler;
