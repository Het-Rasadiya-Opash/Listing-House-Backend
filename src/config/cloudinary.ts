import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;

const configureCloudinary = () => {
  if (!isConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });
    isConfigured = true;
  }
};

const uploadOnCloudinary = async (fileBuffer: Buffer, mimetype: string) => {
  try {
    configureCloudinary();
    if (!fileBuffer) return null;
    const response = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "listings" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(fileBuffer);
    });
    return response;
  } catch (error: any) {
    console.error("Cloudinary upload error:", error.message);
    return null;
  }
};

const deleteFromCloudinary = async (cloudinaryUrl: string) => {
  try {
    configureCloudinary();
    if (!cloudinaryUrl) return null;

    const urlParts = cloudinaryUrl.split("/");
    const uploadIndex = urlParts.indexOf("upload");
    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join("/");
    const publicId = pathAfterUpload.split(".")[0];

    if (!publicId) {
      console.error("Could not extract public_id from URL:", cloudinaryUrl);
      return null;
    }

    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (error: any) {
    console.error("Cloudinary delete error:", error.message);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
