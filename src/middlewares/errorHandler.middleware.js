export const errorHandler = (err, req, res, next) => {
  console.log(`Error: ${err.message}`);
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
  });
};
