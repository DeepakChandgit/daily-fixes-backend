import jwt from "jsonwebtoken";
import { ApiError, asyncHandler } from "#utils";
import { User } from "#models/user.model.js";

// Cookie Config
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};

export const accessTokenMiddleware = asyncHandler(async (req, res, next) => {
  const token = req?.cookies?.accessToken;

  if (!token || typeof token !== "string") {
    res.clearCookie("accessToken", cookieOptions);
    throw new ApiError({
      statusCode: 401,
      message: "Invalid authentication,please login again",
    });
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (!decodedToken?._id) {
    throw new ApiError({ statusCode: 401, message: "Unauthorized request" });
  }

  const user = await User.findById(decodedToken._id).select("+banned");

  if (user.banned === true) {
    throw new ApiError({
      statusCode: 401,
      message:
        "Access denied, You don't have permission to perform any action please contact support ",
    });
  }

  req.user = user;

  next();
});

export const refreshTokenMiddleware = asyncHandler(async (req, res, next) => {
  const token = req?.cookies?.refreshToken;

  if (!token || typeof token !== "string") {
    clearAuthCookies(res);
    throw new ApiError({
      statusCode: 401,
      message: "Invalid authentication,please login again",
    });
  }

  const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decodedToken._id).select("+banned");

  if (user.banned === true) {
    throw new ApiError({
      statusCode: 401,
      message:
        "Access denied, You don't have permission to perform any action please contact support ",
    });
  }
  req.user = user;

  next();
});

export const authorizedRolesMiddleware = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
      clearAuthCookies(res);

      throw new ApiError({
        statusCode: 401,
        message: "Invalid authentication, Please login again",
      });
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ApiError({
        statusCode: 403,
        message: "Unauthorized request, Access denied ",
      });
    }

    next();
  });
};
