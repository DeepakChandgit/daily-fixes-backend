import express from "express";
import dotenv from "dotenv";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import { errorHandler } from "#middlewares/errorHandler.middleware.js";

const app = express();

dotenv.config({ path: "../.env" });

// cors middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// json data parsing middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// secure middlewares
app.use(helmet());

app.use(mongoSanitize());

app.use(errorHandler);

export default app;
