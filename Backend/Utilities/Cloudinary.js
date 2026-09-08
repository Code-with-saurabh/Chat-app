const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const isImage = IMAGE_MIME_TYPES.some(type =>
            localFilePath.toLowerCase().endsWith(type.replace("image/", "."))
        );

        const uploadOptions = {
            resource_type: "auto",
            folder: "chat-app",
        };

        if (isImage) {
            uploadOptions.quality = "auto:best";
            uploadOptions.fetch_format = "auto";
            uploadOptions.transformation = [
                { width: 500, height: 500, crop: "limit" }
            ];
        }

        const response = await cloudinary.uploader.upload(localFilePath, uploadOptions);

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response;

    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

module.exports = { uploadOnCloudinary };
