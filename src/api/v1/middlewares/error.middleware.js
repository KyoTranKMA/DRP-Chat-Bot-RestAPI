const httpStatus = require('http-status').default;
const ApiError = require('../utils/ApiError.js');


// Middleware chuyển đổi bất kỳ loại lỗi nào thành định dạng ApiError nhất quán để xử lý lỗi có thể đến từ nhiều nguồn khác nhau (cơ sở dữ liệu, xác thực...) và có chung format dễ debug hơn
const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = err;
  const response = {
    code: statusCode,
    message,
    stack: process.env.NODE_ENV === 'Development' ? err.stack : undefined,
  };
  res.status(statusCode).json(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};