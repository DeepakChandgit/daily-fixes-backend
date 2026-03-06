import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "#middlewares/errorHandler.middleware.js";
import { authRouter } from "#routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config({ path: "../.env" });

app.use(helmet());

// cors middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// cookie parsing middleware
app.use(cookieParser());
// json data parsing middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// routes

app.use("/api/v1/auth", authRouter);

// middleware to catch req which doesn't exists
app.all("*", (req, res, next) => {
  next(
    new ApiError({
      statusCode: 404,
      message: `${req.originalUrl} not found`,
    })
  );
});

app.use(errorHandler);

export default app;
