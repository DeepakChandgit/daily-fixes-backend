import { asyncHandler, ApiError, ApiResponse } from "#utils";
import {
  createCategoryService,
  getAllCategoriesService,
  toggleCategoryActiveStatusService,
} from "./categories.service.js";

export const createCategoryController = asyncHandler(async (req, res) => {
  const user = req.user;
  const { name } = req?.body || {};
  const localFilePath = req?.file?.path;
  console.log(name);

  if (!user || !name) {
    throw new ApiError({ statusCode: 400, message: "Invalid or bad request" });
  }

  const createdCategory = await createCategoryService({
    name: name.toLowerCase().trim(),
    user,
    localFilePath,
  });

  res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      data: createdCategory,
      message: "Category created successfully",
    })
  );
});

export const getAllCategoriesController = asyncHandler(async (req, res) => {
  const categories = await getAllCategoriesService();

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: categories,
      message:
        categories.length <= 0
          ? "Categories not added yet"
          : "Categories found successfully",
    })
  );
});

export const toggleCategoryActiveStatusController = asyncHandler(
  async (req, res) => {
    const categoryId = req?.params?.id || "";

    if (!categoryId) {
      throw new ApiError({
        statusCode: 400,
        message: "Please provide valid request",
      });
    }

    const category = await toggleCategoryActiveStatusService(categoryId);

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: category,
        message: category.isActive
          ? "Category is activated"
          : "Category is deactivated",
      })
    );
  }
);
