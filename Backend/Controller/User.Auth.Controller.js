const ApiError = require("../Utilities/ApiError");
const ApiResponse = require("../Utilities/ApiResponse");
const asyncHandler = require("../Utilities/AsyncHandler");

const axios = require('axios');
const FormData = require('form-data');

const bcrypt = require('bcryptjs');  
const multer = require('multer');  
const User = require('../models/User');
const Chat = require('../models/Chat');



const register = asyncHandler(async (req, res) => {
    console.log("\n\nThis is register page\n\n",req.body);

    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        throw new ApiError(400, "Username, email, and password are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ Username: username }, { Email: email }],
    });

    if (existingUser) {
        const errorField =
            existingUser.Username === username ? "Username" : "Email";

        throw new ApiError(409, `${errorField} already in use`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl = null;

    // Upload profile image to ImgBB if provided
    if (req.file) {
        const formData = new FormData();
        formData.append("key", process.env.IMGBB_API_KEY);
        formData.append(
            "name",
            `${Date.now()}-${req.file.originalname}`
        );
        formData.append(
            "image",
            req.file.buffer.toString("base64")
        );

        const response = await axios.post(
            process.env.IMGBB_URL,
            formData,
            {
                headers: formData.getHeaders(),
                maxBodyLength: Infinity,
            }
        );

        imageUrl = response.data.data.url;
    }

    // Create user
    const newUser = await User.create({
        Username: username,
        Email: email,
        Password: hashedPassword,
        ProfileImage: imageUrl,
    });

    return res.status(201).json(
        new ApiResponse(201, {
            userId: newUser._id,
            username: newUser.Username,
            email: newUser.Email,
        }, "User registered successfully")
    );
});

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        throw new ApiError(400, "Username and password are required");
    }

    // Check if user exists
    const user = await User.findOne({ Username: username });

    if (!user) {
        throw new ApiError(404, "Username not found");
    }

    // Compare password
    const isPasswordMatched = await bcrypt.compare(
        password,
        user.Password
    );

    if (!isPasswordMatched) {
        throw new ApiError(401, "Invalid credentials");
    }

    console.log("User logged in successfully");

    return res.status(200).json(
        new ApiResponse(200, {
            id: user._id,
            username: user.Username,
            email: user.Email,
            profileImage: user.ProfileImage,
        }, "User login successful")
    );
});

module.exports = { register,login };
