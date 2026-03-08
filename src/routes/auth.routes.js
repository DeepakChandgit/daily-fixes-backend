import { Router } from "express";
import { validate } from "#middlewares/validate.middleware.js";
import {
  authorizedRolesMiddleware,
  accessTokenMiddleware,
  refreshTokenMiddleware,
} from "#middlewares/auth.middleware.js";
import {
  registerValidationSchema,
  loginValidationSchema,
} from "#validations/auth.validation.js";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshTokenController,
} from "#features/auth/auth.controller.js";

const router = Router();

router.post(
  "/register",
  validate(registerValidationSchema),
  registerUserController
);

router.post("/login", validate(loginValidationSchema), loginUserController);

router.post(
  "/logout",
  accessTokenMiddleware,
  authorizedRolesMiddleware("customer", "provider", "admin"),
  logoutUserController
);

router.post(
  "/refresh-tokens",
  refreshTokenMiddleware,
  authorizedRolesMiddleware("customer", "provider", "admin"),
  refreshTokenController
);

export { router as authRouter };
