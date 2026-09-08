const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const { register, login, searchUser, getAllUsers, updateProfile } = require('../Controller/User.Auth.Controller.js');
const { upload } = require('../Middleware/Multer.middleware.js');
const verifyJWT = require('../Middleware/Auth.middleware.js');
const { createOrGetConversation } = require('../Controller/conversation.controller.js');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Too many attempts, please try again after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});

const searchLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message: { success: false, message: "Too many search requests, please slow down" },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/register", authLimiter, upload.single('file'), register);
router.post("/login", authLimiter, login);
router.get("/search", verifyJWT, searchLimiter, searchUser);
router.get("/allUsers", verifyJWT, getAllUsers);
router.post("/conversation", verifyJWT, createOrGetConversation);
router.post("/update-profile", verifyJWT, upload.single('file'), updateProfile);

module.exports = router;
