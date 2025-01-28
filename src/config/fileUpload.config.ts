import { HttpException, HttpStatus } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_FILE_EXTENSION: ["PNG", "JPG", "GIF", "JPEG", "WEBP"],
};

export const fileUploadOptions: MulterOptions = {
  limits: {
    fileSize: FILE_UPLOAD_CONFIG.MAX_FILE_SIZE,
  },
  fileFilter: (req: any, file: Express.Multer.File, callback: any) => {
    if (
      !file.mimetype.startsWith("image/") &&
      !FILE_UPLOAD_CONFIG.ALLOWED_FILE_EXTENSION.includes(
        file.originalname.split(".").pop().toUpperCase(),
      )
    ) {
      return callback(
        new HttpException(
          `File type not allowed. Allowed types: image`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }

    callback(null, true);
  },
};
