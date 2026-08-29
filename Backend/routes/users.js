const express = require('express');
const router = express.Router();

const { register, login, searchUser, getAllUsers, updateProfile } = require('../Controller/User.Auth.Controller.js');
const { upload } = require('../Middleware/Multer.middleware.js');
const verifyJWT = require('../Middleware/Auth.middleware.js');
const { createOrGetConversation } = require('../Controller/conversation.controller.js');

router.post("/register", upload.single('file'), register);
router.post("/login", login);
router.get("/search", verifyJWT, searchUser);
router.get("/allUsers", verifyJWT, getAllUsers);
router.post("/conversation", verifyJWT, createOrGetConversation);
router.post("/update-profile", verifyJWT, upload.single('file'), updateProfile);

module.exports = router;
