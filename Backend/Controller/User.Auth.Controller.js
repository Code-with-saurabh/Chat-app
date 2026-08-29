const ApiError = require("../Utilities/ApiError");
const ApiResponse = require("../Utilities/ApiResponse");
const asyncHandler = require("../Utilities/AsyncHandler");
const path = require("path");
const { uploadOnCloudinary } = require("../Utilities/Cloudinary");
const User = require('../models/userSchema.models.js');
const Conversation = require('../models/conversationSchema.models.js');
const RefreshToken = require('../models/refreshTokenSchema.models.js');

const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new ApiError(400, "Username, email, and password are required");
    }

    const existingUser = await User.findOne({
        $or: [{ Username: username }, { Email: email }],
    });

    if (existingUser) {
        const errorField =
            existingUser.Username === username ? "Username" : "Email";
        throw new ApiError(409, `${errorField} already in use`);
    }

    let imageUrl = null;

    if (req.file?.path) {
        const uploadedFile = await uploadOnCloudinary(req.file.path);
        if (uploadedFile) {
            imageUrl = uploadedFile.secure_url;
        }
    }

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
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
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
});

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiError(400, "Username and password are required");
    }

    const user = await User.findOne({ Username: username });

    if (!user) {
        throw new ApiError(404, "Username not found");
    }

    const isPasswordMatched = user.comparePassword(password);

    if (!isPasswordMatched) {
        throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = await user.accessToken();
    const refreshToken = await user.refershhToken();

    await RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {
            id: user._id,
            username: user.Username,
            email: user.Email,
            profileImage: user.ProfileImage,
            accessToken,
            refreshToken,
        }, "User login successful")
    );
});

const searchUser = asyncHandler(async (req, res) => {
    const { username } = req.query;

    if (!username) {
        throw new ApiError(400, "Username query parameter is required");
    }

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
                email: user.Email,
            },
            `User found: ${user.Username}`
        )
    );
});

const getAllUsers = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not authenticated");
    }

    const currentUserId = req.user._id;

    const conversations = await Conversation.find({
        members: currentUserId
    })
        .populate({
            path: "lastMessage",
            select: "text sender createdAt"
        })
        .populate({
            path: "members",
            select: "Username ProfileImage isOnline lastSeen"
        })
        .sort({ updatedAt: -1 });

    const conversationUsers = conversations.map((conv) => {
        const otherUser = conv.members.find(
            member => member._id.toString() !== currentUserId.toString()
        );

        if (!otherUser) return null;

        const DefaultImagePath = path.join(__dirname, "..", "uploads", "default-avatar-profile-icon.jpg");

        return {
            conversationId: conv._id,
            id: otherUser._id,
            username: otherUser.Username,
            profileImage: otherUser.ProfileImage || DefaultImagePath || null,
            isOnline: otherUser.isOnline,
            lastSeen: otherUser.lastSeen,
            lastMessage: conv.lastMessage
                ? {
                    text: conv.lastMessage.text || "",
                    sender: conv.lastMessage.sender || null,
                    createdAt: conv.lastMessage.createdAt || null
                }
                : null
        };
    }).filter(Boolean);

    const allUsers = await User.find({
        _id: { $ne: currentUserId }
    }).select("Username ProfileImage isOnline lastSeen");

    const conversationUserIds = conversationUsers.map(u => u.id.toString());

    const newUsers = allUsers
        .filter(user => !conversationUserIds.includes(user._id.toString()))
        .map(user => ({
            conversationId: null,
            id: user._id,
            username: user.Username,
            profileImage: user.ProfileImage || null,
            lastMessage: null
        }));

    const finalUsers = [...conversationUsers, ...newUsers];

    return res.status(200).json(
        new ApiResponse(200, finalUsers, "Users fetched successfully")
    );
});

const updateProfile = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const userId = req.user._id;

    if (!username || !email || !userId) {
        throw new ApiError(400, "Username and email are required");
    }

    try {
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            throw new ApiError(404, "User not found");
        }

        const duplicateUser = await User.findOne({
            _id: { $ne: userId },
            $or: [
                { Username: username },
                { Email: email },
            ],
        });

        if (duplicateUser) {
            if (duplicateUser.Username === username) {
                throw new ApiError(409, "Username already taken");
            }
            if (duplicateUser.Email === email) {
                throw new ApiError(409, "Email already registered");
            }
        }

        let imageUrl = null;
        if (req.file?.path) {
            const uploadedFile = await uploadOnCloudinary(req.file.path);
            if (uploadedFile) imageUrl = uploadedFile.secure_url;
        }

        existingUser.Username = username;
        existingUser.Email = email;
        if (password) existingUser.Password = password;
        if (imageUrl) existingUser.ProfileImage = imageUrl;

        await existingUser.save();

        return res.status(200).json(
            new ApiResponse(200, {
                userId: existingUser._id,
                username: existingUser.Username,
                email: existingUser.Email,
                profileImage: existingUser.ProfileImage,
            }, "Profile updated successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to update profile");
    }
});

module.exports = { register, login, searchUser, getAllUsers, updateProfile };
