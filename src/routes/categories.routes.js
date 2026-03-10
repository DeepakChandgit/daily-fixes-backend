import { Router } from "express";
import {
  accessTokenMiddleware,
  authorizedRolesMiddleware,
} from "#middlewares/auth.middleware.js";
import { upload } from "#middlewares/multer.middleware.js";
import {
  createCategoryController,
  getAllCategoriesController,
  toggleCategoryActiveStatusController,
} from "#features/categories/categories.controller.js";

const router = Router();

router.get("/", getAllCategoriesController);

router.post(
  "/",
  accessTokenMiddleware,
  authorizedRolesMiddleware("admin"),
  upload.single("image"),
  createCategoryController
);
router.patch(
  "/:id",
  accessTokenMiddleware,
  authorizedRolesMiddleware("admin"),
  toggleCategoryActiveStatusController
);

export { router as categoriesRouter };
