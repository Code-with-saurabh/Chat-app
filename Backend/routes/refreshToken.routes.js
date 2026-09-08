const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const verifyJWT = require("../Middleware/Auth.middleware.js");

const { refreshAccessToken, logout } = require("../Controller/refreshToken.controller.js");

const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: "Too many refresh attempts, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/refresh-token", refreshLimiter, refreshAccessToken);
router.post("/logout", verifyJWT, logout);

module.exports = router;
