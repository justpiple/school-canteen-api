import { HttpException, HttpStatus } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_MIME_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
};

export const fileUploadOptions: MulterOptions = {
  limits: {
    fileSize: FILE_UPLOAD_CONFIG.MAX_FILE_SIZE,
  },
  fileFilter: (req: any, file: Express.Multer.File, callback: any) => {
    // Validate mime type
    if (!FILE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return callback(
        new HttpException(
          `File type not allowed. Allowed types: ${FILE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES.join(", ")}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }

    callback(null, true);
  },
};
