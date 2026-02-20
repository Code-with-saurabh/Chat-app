const cloudinary = require("cloudinary").v2;
const fs = require("fs")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        // const response = await cloudinary.uploader.upload(localFilePath, {
        //     resource_type: "auto"
        // })
        const response = await cloudinary.uploader.upload(localFilePath, {
    resource_type: "auto",
    folder: "chat-app",
    quality: "auto:best",          // 🔥 High quality
    fetch_format: "auto",
    transformation: [
        { width: 500, height: 500, crop: "limit" }  // limit resize (no stretch)
    ]
});
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log("Yes")
        }

        console.log(response);

        return response;


    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload  n got failed
        return null;
    }
}



module.exports = { uploadOnCloudinary }