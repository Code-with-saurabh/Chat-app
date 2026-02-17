const ApiError = require("../Utilities/ApiError");
const ApiResponse = require("../Utilities/ApiResponse");
const asyncHandler = require("../Utilities/AsyncHandler");
const fs = require("fs");



const { uploadOnCloudinary } = require("../Utilities/Cloudinary");



// const User = require('../models/User');
const User = require('../models/userSchema.models.js');
const RefreshToken = require('../models/refreshTokenSchema.models.js');




const register = asyncHandler(async (req, res) => {
    console.log("\n\nThis is register page\n\n", req.body);

    const { username, email, password } = req.body;
    console.log("\n\nUSERRRRR : ", req.body);


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





    let imageUrl = null;

    // ✅ Cloudinary Upload
    if (req.file?.path) {
        const uploadedFile = await uploadOnCloudinary(req.file.path);

        if (uploadedFile) {
            imageUrl = uploadedFile.secure_url;
        }
        fs.unlinkSync(req.file.path);
    }

    console.log(req.file?.path);

    // create user
    const newUser = await User.create({
        Username: username,
        Email: email,
        Password: password,
        ProfileImage: imageUrl,
    });


    const accessToken = await newUser.accessToken();
    const refreshToken = await newUser.refershhToken();

    await RefreshToken.create({
        user: newUser._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    return res.status(201).json(
        new ApiResponse(201, {
            userId: newUser._id,
            username: newUser.Username,
            email: newUser.Email,
            accessToken,
            refreshToken,
        }, "User registered successfully")
    );


    // return res.status(201).json(
    //     new ApiResponse(201, {
    //         userId: newUser._id,
    //         username: newUser.Username,
    //         email: newUser.Email,
    //     }, "User registered successfully")
    // );
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
    const isPasswordMatched = user.comparePassword(password);

    if (!isPasswordMatched) {
        throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = await user.accessToken();
    const refreshToken = await user.refershhToken();

    await RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
        )
    });

    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

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

const searchUser = asyncHandler(async (req, res) => {
    const { username } = req.query;

    // Validate query
    if (!username) {
        throw new ApiError(400, "Username query parameter is required");
    }

    // Find user
    const user = await User.findOne({ Username: username });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                id: user._id,
                username: user.Username,
                profileImage: user.ProfileImage,
            },
            `User found: ${user.Username}`
        )
    );
});


const getAllUsers = asyncHandler(async (req, res) => {

    const allUsers = await User
        .find({})
        .select("Username ProfileImage")
        .select("-Password");

    // const allUsers = await User.aggregate([
    //     {
    //         $project: {
    //             Username: 1,
    //             ProfileImage: 1,
    //         },
    //     },
    // ]);

    // console.log("allUsers : ", allUsers);

    if (!allUsers || allUsers.length === 0) {
        throw new ApiError(404, "No users found");
    }

    const users = allUsers.map(user => ({
        id: user._id,
        username: user.Username,
        profileImage: user.ProfileImage || null,
    }));

    return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "All users retrieved successfully"
        )
    );
});

module.exports = { register, login, searchUser, getAllUsers };

//Test the git 