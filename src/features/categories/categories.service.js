import { Category } from "#models/category.model.js";
import { uploadOnCloudinary } from "#utils";

export const createCategoryService = async ({ user, name, localFilePath }) => {
  if (!name || !user) {
    throw new ApiError({
      statusCode: 401,
      message: "Unauthorized or invalid request",
    });
  }

  let cloudinaryResponse;

  if (localFilePath) {
    cloudinaryResponse = await uploadOnCloudinary(
      localFilePath,
      "categories-image"
    );
  }

  const createdCategory = await Category.create({
    name,
    image: {
      publicId: cloudinaryResponse?.publicId || "",
      resourceType: cloudinaryResponse?.resourceType || "",
      url: cloudinaryResponse?.url || "",
    },
  });

  if (!createdCategory) {
    throw new ApiError({ statusCode: 500, message: "Something went wrong" });
  }

  return createdCategory;
};

export const getAllCategoriesService = async () => {
  const categories = await Category.find({ isActive: true });

  return categories;
};

export const toggleCategoryActiveStatusService = async (categoryId) => {
  if (!categoryId) {
    throw new ApiError({ statusCode: 400, message: "Invalid request" });
  }

  const category = await Category.findById(categoryId);

  category.isActive = !category?.isActive;

  const updatedCategory = await category.save();

  return updatedCategory;
};
