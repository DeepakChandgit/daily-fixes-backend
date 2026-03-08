import { UserDTOResponse } from "#dtos/user.dto.js";
import { ApiError, ApiResponse, asyncHandler } from "#utils";
import {
  getLoggedInUserService,
  changePasswordService,
  updateUserService,
  updateUserAvatarService,
} from "./user.service.js";

export const getLoggedInUserController = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;

  if (!userId) {
    throw new ApiError({
      statusCode: 401,
      message: "Unauthorized request,Please login",
    });
  }

  const loggedInUser = await getLoggedInUserService(userId);

  if (!loggedInUser) {
    throw new ApiError({ statusCode: 400, message: "Invalid request" });
  }

  const user = new UserDTOResponse(loggedInUser);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: user,
      message: "User found successfully",
    })
  );
});

export const updateUserController = asyncHandler(async (req, res) => {
  const { name, email, phone } = req?.body || {};
  const user = req.user;

  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: "Unauthorized request access denied",
    });
  }
  if (!name || !email || !phone) {
    throw new ApiError({
      statusCode: 400,
      message: "Invalid request",
    });
  }

  let updatedUser = await updateUserService({ user, name, email, phone });

  if (!updatedUser) {
    throw new ApiError({ statusCode: 500, message: "Something went wrong " });
  }

  updatedUser = new UserDTOResponse(updatedUser);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: updatedUser,
      message: "User updated successfully",
    })
  );
});

export const updateUserAvatarController = asyncHandler(async (req, res) => {
  const avatar = req?.file;
  const user = req.user;

  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: "Unauthorized request access denied",
    });
  }

  if (!avatar || !avatar?.path) {
    throw new ApiError({
      statusCode: 400,
      message: "Avatar file is required",
    });
  }

  let updatedUser = await updateUserAvatarService({
    user,
    localFilePath: avatar.path,
  });

  if (!updatedUser) {
    throw new ApiError({ statusCode: 500, message: "Something went wrong " });
  }

  updatedUser = new UserDTOResponse(updatedUser);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: updatedUser,
      message: "User updated successfully",
    })
  );
});

export const changePasswordController = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  const user = req.user;

  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: "Your are not authorized to make this request",
    });
  }

  if (!oldPassword || !newPassword) {
    throw new ApiError({
      statusCode: 400,
      message: "Please enter the required fields",
    });
  }

  if (oldPassword === newPassword) {
    throw new ApiError({
      statusCode: 400,
      message: "Old and new password cannot be same",
    });
  }

  const updatedUser = await changePasswordService({
    user,
    oldPassword,
    newPassword,
  });

  if (!updatedUser) {
    throw new ApiError({
      statusCode: 500,
      message: "Something went wrong please try again",
    });
  }

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Password updated successfully",
    })
  );
});
