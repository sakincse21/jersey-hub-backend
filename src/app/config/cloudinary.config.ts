import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";
import stream from "stream";
import AppError from "../errorHelpers/appErrorHandler";
import httpStatus from "http-status";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  fileName: string
): Promise<UploadApiResponse | undefined> => {
  try {
    return new Promise((resolve, reject) => {
      const public_id = `jersey/${fileName}-${Date.now()}`;
      const bufferString = new stream.PassThrough();
      bufferString.end(buffer);

      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            public_id: public_id,
            folder: `jersey`,
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        )
        .end(buffer);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    throw new AppError(401, `Error uploading file: ${error.message}`);
  }
};

export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

    const match = url.match(regex);

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log(`File ${public_id} is deleted from cloudinary`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cloudinary image deletion failed",
      error.message
    );
  }
};

// const uploadToCloudinary = cloudinary.uploader.upload()

//instead of using manually uploading, we'll use a package ig
//multer-storage-cloudinary =>> it won't use storage in our server instead, uploads the file directly to cloudinary and provides url in req.file in server request

export const cloudinaryUpload = cloudinary;
