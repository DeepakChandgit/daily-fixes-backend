import { Router } from "express";
import { upload } from "#middlewares/multer.middleware.js";
import {
  accessTokenMiddleware,
  authorizedRolesMiddleware,
} from "#middlewares/auth.middleware.js";
import {
  getLoggedInUserController,
  updateUserController,
  updateUserAvatarController,
  changePasswordController,
} from "#features/user/user.controller.js";
import { validate } from "#middlewares/validate.middleware.js";
import {
  updateUserValidationSchema,
  changePasswordValidationSchema,
} from "#validations/user.validation.js";

const router = Router();

router
  .route("/me")
  .get(
    accessTokenMiddleware,
    authorizedRolesMiddleware("customer"),
    getLoggedInUserController
  );

router
  .route("/update")
  .patch(
    accessTokenMiddleware,
    validate(updateUserValidationSchema),
    authorizedRolesMiddleware("customer"),
    updateUserController
  );

router
  .route("/update/avatar")
  .patch(
    accessTokenMiddleware,
    authorizedRolesMiddleware("customer"),
    upload.single("avatar"),
    updateUserAvatarController
  );

router.patch(
  "/change-password",
  validate(changePasswordValidationSchema),
  accessTokenMiddleware,
  authorizedRolesMiddleware("customer", "provider", "admin"),
  changePasswordController
);

export { router as userRouter };
