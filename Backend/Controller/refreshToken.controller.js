const jwt = require("jsonwebtoken");
const ApiError = require("../Utilities/ApiError");
const ApiResponse = require("../Utilities/ApiResponse");
const asyncHandler = require("../Utilities/AsyncHandler");
const User = require("../models/userSchema.models.js");
const RefreshToken = require("../models/refreshTokenSchema.models.js");

const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedToken) {
        throw new ApiError(403, "Invalid refresh token");
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new ApiError(403, "Refresh token expired or invalid");
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const newAccessToken = await user.accessToken();

    return res.status(200).json(
        new ApiResponse(
            200,
            { accessToken: newAccessToken },
            "Access token refreshed successfully"
        )
    );
});

const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
        await RefreshToken.deleteOne({ token: refreshToken });
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Logged out successfully")
    );
});

const cleanupExpiredTokens = asyncHandler(async () => {
    const result = await RefreshToken.deleteMany({
        expiresAt: { $lt: new Date() }
    });
    return result.deletedCount;
});

module.exports = { refreshAccessToken, logout, cleanupExpiredTokens };
