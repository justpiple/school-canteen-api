import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "src/config/cloudinary.config";

@Injectable()
export class CloudinaryService {
  private readonly uploader: any;

  constructor() {
    this.uploader = cloudinary.uploader;
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const uploadedFile: UploadApiResponse = await new Promise(
        (resolve, reject) => {
          this.uploader
            .upload_stream(
              { upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET },
              (error, result) => {
                if (error) reject(error);
                resolve(result);
              },
            )
            .end(file.buffer);
        },
      );

      return uploadedFile.secure_url;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `File upload failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
