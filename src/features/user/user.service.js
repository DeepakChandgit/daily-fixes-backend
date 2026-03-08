import { User } from "#models/user.model.js";
import { ApiError, uploadOnCloudinary, deleteFromCloudinary } from "#utils";

export const getLoggedInUserService = async (userId) => {
  if (!userId) {
    throw new ApiError({
      statusCode: 400,
      message: "Unauthorized request,Please login",
    });
  }

  const loggedInUser = await User.findById(userId);

  if (!loggedInUser) {
    throw new ApiError({ statusCode: 400, message: "Invalid request" });
  }

  return loggedInUser;
};

export const updateUserService = async ({ user, name, email, phone }) => {
  const userId = user?._id;

  if (!userId || !name || !email || !phone) {
    throw new ApiError({ statusCode: 400, message: "Invalid request" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      name,
      email,
      phone,
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  if (!updatedUser) {
    throw new ApiError({
      statusCode: 500,
      message: "Something went wrong try aging",
    });
  }

  return updatedUser;
};

export const updateUserAvatarService = async ({ user, localFilePath }) => {
  const userId = user?._id;

  if (!userId || !localFilePath) {
    throw new ApiError({ statusCode: 400, message: "Invalid request" });
  }

  const fetchedUser = await User.findById(userId);

  if (!fetchedUser) {
    throw new ApiError({ statusCode: 400, message: "Invalid request" });
  }

  if (fetchedUser?.avatar?.publicId) {
    const result = await deleteFromCloudinary(
      fetchedUser?.avatar?.publicId,
      "image",
      localFilePath
    );
  }

  const cloudinaryResponse = await uploadOnCloudinary(
    localFilePath,
    "user-avatar"
  );

  if (!cloudinaryResponse?.url) {
    throw new ApiError({
      statusCode: 500,
      message: "Error uploading avatar to cloud",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { avatar: cloudinaryResponse } },
    {
      returnDocument: "after",
    }
  );
  return updatedUser;
};

export const changePasswordService = async ({
  user,
  oldPassword,
  newPassword,
}) => {
  const userId = user?._id;

  if (!userId || !oldPassword || !newPassword) {
    throw new ApiError({
      statusCode: 400,
      message: "Invalid or unauthorized request",
    });
  }

  const loggedInUser = await User.findById(userId).select("+password");

  if (!loggedInUser) {
    throw new ApiError({ statusCode: 400, message: "Invalid request" });
  }

  const passwordIsValid = await loggedInUser.isPasswordCorrect(oldPassword);

  if (!passwordIsValid) {
    throw new ApiError({
      statusCode: 400,
      message: "Invalid request old password is incorrect",
    });
  }

  loggedInUser.password = newPassword.trim();
  loggedInUser.save();

  return loggedInUser;
};
