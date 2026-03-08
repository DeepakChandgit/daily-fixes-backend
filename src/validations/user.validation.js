import Joi from "joi";

const emailField = Joi.string().email().required().trim().messages({
  "string.empty": "Email is required",
  "string.email": "Please enter a valid email address",
  "any.required": "Email is required",
});

export const updateUserValidationSchema = Joi.object({
  name: Joi.string().min(3).required().trim().message({
    "string.empty": "Name is required",
    "string.min": "Name must have 3 characters",
  }),
  email: emailField,
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .min(10)
    .max(10)
    .required()
    .trim()
    .messages({
      "string.empty": "Phone number must be a valid 10-digit",
      "string.min": "Phone number must be a valid 10-digit",
      "string.max": "Phone number must be a valid 10-digit",
      "string.pattern.base": "Phone number must be a valid 10-digit",
      "any.required": "Phone number is required",
    }),
});

export const changePasswordValidationSchema = Joi.object({
  newPassword: Joi.string()
    .min(8)
    .max(15)
    .required()
    .trim()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/)
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "The password length must not exceed 15 characters",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number and special character",
      "any.required": "Password is required",
    }),
  oldPassword: Joi.string().required().trim().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});
