import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import { ApiError } from "#utils";
import path from "path";

// Cloudinary Configure
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (
  localFilePath,
  cloudinaryFolder = "default"
) => {
  if (!localFilePath) {
    throw new ApiError({
      statusCode: 400,
      message: "Local file path is required.",
    });
  }

  const extType = path.extname(localFilePath).toLowerCase();
  const resourceType = extType === ".pdf" ? "raw" : "auto";

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: `dailyfixes/${cloudinaryFolder}`,
      use_filename: true,
      resource_type: resourceType,
    });

    return {
      publicId: result.public_id,
      resourceType: result.resource_type,
      url: result.secure_url,
    };
  } catch (error) {
    throw new ApiError({
      statusCode: 500,
      message: "Failed to upload file to Cloudinary.",
    });
  } finally {
    await fs.unlink(localFilePath);
  }
};

export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image",
  localFilePath = null
) => {
  if (!publicId) {
    throw new ApiError({
      statusCode: 400,
      message: "File publicId is required.",
    });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    if (localFilePath) {
      await fs.unlink(localFilePath);
    }
    throw new ApiError({
      statusCode: 500,
      message: "Error while deleting old file.",
    });
  }
};
