import { HttpException, HttpStatus } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
};

export const fileUploadOptions: MulterOptions = {
  limits: {
    fileSize: FILE_UPLOAD_CONFIG.MAX_FILE_SIZE,
  },
  fileFilter: (req: any, file: Express.Multer.File, callback: any) => {
    // Validate mime type
    if (!file.mimetype.startsWith("image/")) {
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
