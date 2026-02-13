const ApiError = require("../Utilities/ApiError");
const ApiResponse = require("../Utilities/ApiResponse");
const asyncHandler = require("../Utilities/AsyncHandler");

const register = asyncHandler(async (req, res) => {
    console.log("\n\nThis is register page\n\n");

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

module.exports = { register };
