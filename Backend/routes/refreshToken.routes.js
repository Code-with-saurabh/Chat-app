const express = require("express");
const router = express.Router();

const { refreshAccessToken } = require("../Controller/refreshToken.controller.js");

router.post("/refresh-token", refreshAccessToken);

module.exports = router;
