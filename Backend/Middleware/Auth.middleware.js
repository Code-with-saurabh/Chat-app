const jwt = require("jsonwebtoken");
const ApiError = require("../Utilities/ApiError.js");
const asyncHandler = require("../Utilities/AsyncHandler");

const User = require("../models/userSchema.models.js");

const verifyJWT = asyncHandler(async (req, res, next) => {

    // =========================
    // 1️⃣ Token get from header
    // =========================
    const authHeader = req.headers.authorization;

    console.log("Auth Header : ", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Unauthorized request - No token");
    }

    // Bearer TOKEN
    const token = authHeader.split(" ")[1];

    console.log("TOKEN : ", token);


    // =========================
    // 2️⃣ Verify token
    // =========================
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired token");
    }

    // =========================
    // 3️⃣ Find user
    // =========================
    const user = await User.findById(decoded.id)
        .select("-Password");

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    // =========================
    // 4️⃣ Attach user to request
    // =========================
    req.user = user;

    next();
});

module.exports = verifyJWT;
