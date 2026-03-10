export const errorHandler = (err, req, res, next) => {
  console.log(`Error: ${err}`);
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired. Please log in again.";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token. Please log in again.";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found. Invalid: ${err.message}`;
  }

  return res.status(statusCode || 500).json({
    success: false,
    message: message,
  });
};
