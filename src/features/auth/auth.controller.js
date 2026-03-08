import { ApiError, ApiResponse, asyncHandler } from "#utils";
import { UserDTOResponse } from "#dtos/user.dto.js";
import {
  loginUserService,
  registerUserService,
  logoutUserService,
  refreshTokenService,
} from "./auth.service.js";

// Cookie Config
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};

export const registerUserController = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body || {};

  if (!name || !email || !phone || !password) {
    throw new ApiError({
      statusCode: 400,
      message: "Please provide the required fields",
    });
  }

  const sanitizedName = name.trim();
  const sanitizedPhone = phone.trim();
  const sanitizedEmail = email.trim().toLowerCase();
  const sanitizedPassword = password.trim();

  const createdUser = await registerUserService({
    name: sanitizedName,
    phone: sanitizedPhone,
    email: sanitizedEmail,
    password: sanitizedPassword,
  });

  if (!createdUser) {
    throw new ApiError({
      statusCode: 500,
      message: "Something went wrong while creating try again",
    });
  }
  const user = new UserDTOResponse(createdUser);
  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "User registered successfully",
      data: user,
    })
  );
});

export const loginUserController = asyncHandler(async (req, res) => {
  const { email, password } = req?.body || {};

  if (!email || !password) {
    throw new ApiError({
      statusCode: 400,
      message: "Invalid request, Try again",
    });
  }

  const sanitizedEmail = email.trim().toLowerCase();
  const sanitizedPassword = password.trim();

  const { loggedInUser, accessToken, refreshToken } = await loginUserService({
    email: sanitizedEmail,
    password: sanitizedPassword,
  });

  if (!loggedInUser) {
    throw new ApiError({
      statusCode: 500,
      message: "Login failed. Please try again.",
    });
  }

  const user = new UserDTOResponse(loggedInUser);

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse({
        statusCode: 200,
        data: user,
        message: "User logged in successfully",
      })
    );
});

export const logoutUserController = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: "You are already logged out or unauthorized.",
    });
  }
  await logoutUserService(user);

  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(
      new ApiResponse({
        statusCode: 200,
        message: "You have been logged out successfully.",
      })
    );
});

export const refreshTokenController = asyncHandler(async (req, res) => {
  const user = req?.user;
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!user || !incomingRefreshToken) {
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    throw new ApiError({ statusCode: 401, message: "Invalid request" });
  }

  const { accessToken, refreshToken } = await refreshTokenService({
    user,
    token: incomingRefreshToken,
  });

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse({
        statusCode: 200,
        message: "Your session has been successfully refreshed.",
      })
    );
});
