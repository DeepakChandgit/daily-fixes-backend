import Joi from "joi";

const emailField = Joi.string().email().required().trim().messages({
  "string.empty": "Email is required",
  "string.email": "Please enter a valid email address",
  "any.required": "Email is required",
});

export const registerValidationSchema = Joi.object({
  name: Joi.string().min(3).required().trim().message({
    "string.empty": "Name is required",
    "string.min": "Name must have 3 characters",
  }),
  email: emailField,
  password: Joi.string()
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
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .trim()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be a valid 10-digit",
      "any.required": "Phone number is required",
    }),
});

export const loginValidationSchema = Joi.object({
  email: emailField,
  password: Joi.string().required().trim().messages({
    "any.required": "Password is required",
    "string.empty": "Password is required",
  }),
});

export const passwordValidationSchema = Joi.object({
  password: Joi.string()
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
});

export const emailValidationSchema = Joi.object({
  email: emailField,
});
