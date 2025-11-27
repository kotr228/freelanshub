const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose помилка неправильного ID
  if (err.name === 'CastError') {
    const message = 'Ресурс не знайдено';
    error = { message, statusCode: 404 };
  }

  // Mongoose помилка дублікату
  if (err.code === 11000) {
    const message = 'Такий запис вже існує';
    error = { message, statusCode: 400 };
  }

  // Mongoose помилка валідації
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Помилка сервера',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
