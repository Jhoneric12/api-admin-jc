import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { APIError } from "../utils/app-error.js";
import crypto from "node:crypto";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

type FilePathFn = (req: Request, file: Express.Multer.File) => string;

export interface UploadOptions {
  filePath?: string | FilePathFn;
}

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new APIError("Only image files (jpeg, png, webp, gif) are allowed.", 400));
  }
};

export const upload = (options: UploadOptions = {}) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const rawPath =
        typeof options.filePath === "function" ? options.filePath(req, file) : (options.filePath ?? "public/uploads");

      const uploadDir = path.resolve(rawPath);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
      cb(null, uniqueName);
    },
  });

  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter,
  });
};
