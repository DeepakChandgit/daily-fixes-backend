import { ApiError } from "./api.error.js";
const asyncHandler = (requestedHandler) => {
  if (typeof requestedHandler !== "function") {
    throw new ApiError({
      statusCode: 500,
      message: "Expected a function as the request handler",
    });
  }
  return (req, res, next) => {
    Promise.resolve(requestedHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

export { asyncHandler };
