const ApiError = require("../Utilities/ApiError");
const ApiResponse = require("../Utilities/ApiResponse");
const asyncHandler = require("../Utilities/AsyncHandler");



const { uploadOnCloudinary } = require("../Utilities/Cloudinary");



// const User = require('../models/User');
const User = require('../models/userSchema.models.js');
const Conversation = require('../models/conversationSchema.models.js');
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

/*
const getAllUsers = asyncHandler(async (req, res) => {

    const allUsers = await User
        .find({})
        .select("Username ProfileImage")

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
*/
// const getAllUsers = asyncHandler(async (req, res) => {
//     if (!req.user) {
//         throw new ApiError(401, "User not authenticated");
//     }

//     const currentUserId = req.user._id;

//     const conversations = await Conversation.find({
//         members: currentUserId
//     })
//     .populate({
//         path: "lastMessage",
//         select: "text sender createdAt"
//     })
//     .populate({
//         path: "members",
//         select: "Username ProfileImage"
//     })
//     .sort({ updatedAt: -1 }); // 🔥 Latest conversation on top

//     const users = conversations.map((conv) => {

//         if (!conv.members || conv.members.length === 0) return null;

//         const otherUser = conv.members.find(
//             member => member._id.toString() !== currentUserId.toString()
//         );

//         if (!otherUser) return null;

//         return {
//             conversationId: conv._id,  // 🔥 important for unread count
//             id: otherUser._id,
//             username: otherUser.Username,
//             profileImage: otherUser.ProfileImage || null,
//             lastMessage: conv.lastMessage
//                 ? {
//                     text: conv.lastMessage.text || "",
//                     sender: conv.lastMessage.sender || null,
//                     createdAt: conv.lastMessage.createdAt || null
//                 }
//                 : null
//         };
//     }).filter(Boolean);

//     return res.status(200).json(
//         new ApiResponse(
//             200,
//             users,
//             "Conversations fetched successfully"
//         )
//     );
// });


const getAllUsers = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not authenticated");
    }

    const currentUserId = req.user._id;

    // 🔥 1. Get conversations
    const conversations = await Conversation.find({
        members: currentUserId
    })
        .populate({
            path: "lastMessage",
            select: "text sender createdAt"
        })
        .populate({
            path: "members",
            select: "Username ProfileImage"
        })
        .sort({ updatedAt: -1 });

    // 🔥 2. Extract conversation users
    const conversationUsers = conversations.map((conv) => {
        const otherUser = conv.members.find(
            member => member._id.toString() !== currentUserId.toString()
        );

        if (!otherUser) return null;

        return {
            conversationId: conv._id,
            id: otherUser._id,
            username: otherUser.Username,
            profileImage: otherUser.ProfileImage || null,
            lastMessage: conv.lastMessage
                ? {
                    text: conv.lastMessage.text || "",
                    sender: conv.lastMessage.sender || null,
                    createdAt: conv.lastMessage.createdAt || null
                }
                : null
        };
    }).filter(Boolean);

    // 🔥 3. Get ALL users except current user
    const allUsers = await User.find({
        _id: { $ne: currentUserId }
    }).select("Username ProfileImage");

    // 🔥 4. Find users with NO conversation
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

    // 🔥 5. Merge both
    const finalUsers = [...conversationUsers, ...newUsers];

    return res.status(200).json(
        new ApiResponse(200, finalUsers, "Users fetched successfully")
    );
});
module.exports = { register, login, searchUser, getAllUsers };

//Test the git 