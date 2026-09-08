const express = require("express");
const router = express.Router();

const { refreshAccessToken, logout } = require("../Controller/refreshToken.controller.js");

router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);

module.exports = router;
