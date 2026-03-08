import fs from "fs";
import multer from "multer";
import { ApiError } from "#utils";

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/svg+xml",
  "image/png",
  "application/pdf",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(
      new ApiError({ statusCode: 400, message: "Invalid file type" }),
      false
    );
  }
  return cb(null, true);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./public/temp";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});
