import { ApiError } from "#utils";
import { User } from "#models/user.model.js";
import bcrypt from "bcrypt";

const generateAccessAndRefreshTokens = async function (user) {
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  return { accessToken, refreshToken };
};

export const registerUserService = async ({
  name = "",
  password = "",
  email = "",
  phone = "",
}) => {
  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

  if (existingUser) {
    throw new ApiError({
      statusCode: 409,
      message: "User already exists with same credentials",
    });
  }

  const createdUser = await User.create({
    name,
    email,
    phone,
    password,
  });

  return createdUser;
};

export const loginUserService = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError({
      statusCode: 400,
      message: "Please provide valid credentials",
    });
  }

  const loggedInUser = await User.findOne({ email }).select("+password");
  if (!loggedInUser) {
    throw new ApiError({
      statusCode: 401,
      message: "Invalid credentials",
    });
  }
  const passwordIsValid = await loggedInUser.isPasswordCorrect(password);

  if (!passwordIsValid) {
    throw new ApiError({ statusCode: 401, message: "Invalid credentials" });
  }
  if (loggedInUser.banned) {
    throw new ApiError({
      statusCode: 403,
      message: "Account is disabled contact administrator",
    });
  }
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(loggedInUser);

  if (!accessToken || !refreshToken) {
    throw new ApiError({
      statusCode: 500,
      message: "Something went wrong try again",
    });
  }

  const hasedRefreshToken = await bcrypt.hash(refreshToken, 10);

  loggedInUser.refreshToken = hasedRefreshToken;
  await loggedInUser.save({ validateBeforeSave: false });

  return { loggedInUser, accessToken, refreshToken };
};

export const logoutUserService = async (user) => {
  if (!user._id) {
    throw new ApiError({
      statusCode: 403,
      message: "Unauthorized access denied",
    });
  }

  await User.findByIdAndUpdate(user._id, {
    refreshToken: null,
  });
};

export const refreshTokenService = async ({ user, token }) => {
  const incomingRefreshToken = token || null;
  if (!user?._id || !incomingRefreshToken) {
    throw new ApiError({
      statusCode: 401,
      message: "Unauthorized access denied",
    });
  }

  const fetchedUser = await User.findById(user._id).select("+refreshToken");

  if (!fetchedUser || !fetchedUser.refreshToken) {
    throw new ApiError({
      statusCode: 401,
      message: "Invalid session or user does not exist",
    });
  }

  const isTokenValid = await bcrypt.compare(
    incomingRefreshToken,
    fetchedUser.refreshToken
  );

  if (!isTokenValid) {
    throw new ApiError({
      statusCode: 401,
      message: "Session expired, please login again",
    });
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshTokens(fetchedUser);

  const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
  fetchedUser.refreshToken = hashedRefreshToken;
  await fetchedUser.save({ validateBeforeSave: false });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
