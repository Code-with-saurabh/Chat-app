const multer = require("multer");
const ApiError = require("../Utilities/ApiError");
const path = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads/"));
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-").replace(/[^\w.-]/g, "")}`;//  remove spaces & unsafe chars
        cb(null, uniqueName);
    },
});

// Allowed mime types for chat app
const allowedMimeTypes = [
    // Images
    "image/jpeg",
    "image/png",
    "image/webp",

    // Videos
    "video/mp4",
    "video/webm",

    // Audio
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",

    // Documents
    "application/pdf",
];

// File filter
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new ApiError(
                400,
                "Invalid file type. Only images, videos, audio, and PDFs are allowed."
            ),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 25 * 1024 * 1024, // 25MB limit  
    },
});

module.exports = { upload };
