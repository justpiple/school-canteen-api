import * as cloudinary from "cloudinary";

cloudinary.v2.config({
  secure: true,
});

export default cloudinary.v2;
