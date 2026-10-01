require("dotenv").config();

const toNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const config = {
    env: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",

    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT ? toNumber(process.env.PORT, 0) : 0,
    keepAliveIntervalMs: toNumber(process.env.KEEP_ALIVE_INTERVAL_MS, 5 * 60 * 1000),

    mongoUri: process.env.MONGO_URI,

    frontendUrl: process.env.FRONTEND_URL || process.env.CLIENT_URL || "",
    clientUrl: process.env.CLIENT_URL || "",

    jwt: {
        secret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
    },

    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },

    imgbb: {
        apiKey: process.env.IMGBB_API_KEY,
        url: process.env.IMGBB_URL || "https://api.imgbb.com/1/upload",
    },
};

const required = ["mongoUri", "jwt.secret", "jwt.refreshSecret"];

const missing = required.filter((key) => {
    const value = key.split(".").reduce((obj, part) => (obj ? obj[part] : undefined), config);
    return !value;
});

if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

module.exports = config;
