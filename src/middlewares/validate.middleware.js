import { ApiError } from "#utils";

export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: true,
      stripUnknown: true,
    });

    if (error) {
      return next(
        new ApiError({
          statusCode: 400,
          message:
            error?.details[0]?.message || "Invalid data, Validation failed",
        })
      );
    }

    req[property] = value;

    next();
  };
};
