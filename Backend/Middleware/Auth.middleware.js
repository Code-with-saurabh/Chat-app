const jwt = require("jsonwebtoken");
const ApiError = require("../Utilities/ApiError.js");
const asyncHandler = require("../Utilities/AsyncHandler");
const User = require("../models/userSchema.models.js");

const verifyJWT = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Unauthorized request - No token");
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired token");
    }

    const user = await User.findById(decoded.id).select("-Password");

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    req.user = user;

    next();
});

module.exports = verifyJWT;
