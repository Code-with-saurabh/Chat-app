const express = require('express');
const router = express.Router();
// const axios = require('axios');
const axios = require('axios');
// const sharp = require('sharp');
const bcrypt = require('bcryptjs');  
const multer = require('multer');  
const User = require('../models/User');
const Chat = require('../models/Chat');
const FormData = require('form-data');

/*
//disk pe ki taraha se file to upoa karnha hai uske like diskStorage
const storage = multer.diskStorage({
	destination:(req,file,cb)=>{
		cb(null,"uploads/");//tow fileds first is error and second one is a destination where we want to store our img
	},
	filename:(req,file,cb)=>{
		cb(null,Date.now() + ' - '+file.originalname);
	},
});
 
const upload = multer({ storage: storage });// this is a middelware jo /register pe koyi req aaye use se pahale chagea
*/

const storage = multer.memoryStorage();
const upload = multer({storage:storage});



router.post("/register", upload.single('file'), async (req, res) => {
    console.log("\n\nThis is register page\n\n");

    try {
        const { username, password, email } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        const existing = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existing) {
            const errorField = existing.username === username ? 'username' : 'email';
            return res.status(401).json({
                message: `${errorField} already in use`,
            });
        }

        // Hash the password securely
        let salt;
        try {
            salt = await bcrypt.genSalt(10);
			console.log("salt ,try");
        } catch (err) {
            return res.status(500).json({ message: 'Error generating salt' });
        }

        let hashedPassword;
        try {
			console.log("has the pass");
            hashedPassword = await bcrypt.hash(password, salt);
        } catch (err) {
            return res.status(500).json({ message: 'Error hashing password' });
        }

        const profileImage = req.file ? req.file.buffer : null;
        let imageUrl = null;

        // ImgBB API integration for image upload
        if (req.file) {
            const imgbbApiKey = process.env.IMGBB_API_KEY;
            // const imgbbUrl = 'https://api.imgbb.com/1/upload';
            const imgbbUrl =process.env.IMGBB_URL;
            const uniqueFilename = `${Date.now()}-${req.file.originalname}`;

            const formData = new FormData();
            formData.append('key', imgbbApiKey);
            formData.append('name', uniqueFilename);
            formData.append('image', req.file.buffer.toString('base64'));

            try {
                const imgBBResponse = await axios.post(imgbbUrl, formData, {
                    headers: {
                        ...formData.getHeaders(), // Proper headers for multipart/form-data
                    },
					 maxBodyLength: Infinity, 
                });

                imageUrl = imgBBResponse.data.data.url;
                console.log('Image uploaded successfully:', imageUrl);
            } catch (error) {
                console.error('Error uploading image to ImgBB:', error.message);
                return res.status(500).json({ message: 'Error uploading image' });
            }
        }

        const newUser = new User({
            Username: username,
            Password: hashedPassword,
            Email: email,
            ProfileImage: imageUrl, 
        });

        try {
            await newUser.save();
            console.log("\nUser Data Saved Successfully..\n");
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.log("Error In Data Save : " + error);
            res.status(500).json({ message: 'Error saving user data' });
        }

    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const UserExist = await User.findOne({
            Username: username
        });

        if (!UserExist) {
            return res.status(404).json({
                message: "username not found",
            });
        }

        const PassMatched = await bcrypt.compare(password, UserExist.Password);
        if (!PassMatched) {
            return res.status(401).json({
                message: "Wrong Password",
            });
        }

        console.log("User Login Successfully..");

        // Send profile image URL instead of Base64 data
        return res.status(200).json({
            message: "User Login Successfully",
            id: UserExist._id,
            Username: UserExist.Username,
            profileImage: UserExist.ProfileImage,
        });

    } catch (error) {
        return res.status(500).json({
            message: "failed to load data",
        });
    }
});

router.get("/search", async (req, res) => {
    const { username } = req.query;
    
    try {
        const user = await User.findOne({ Username: username });

        if (!user) {
            return res.status(400).json({ message: "Username is required" });
        }
		
        res.status(200).json({
            message: `Searching for user: ${user.Username}`,
			id: user._id,
            Username: user.Username,
            profileImage: user.ProfileImage,
			// Return ImgBB URL here
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Error on Username" });
    }
});

/*
router.get("/allUsers", async (req, res) => {
  try {
    const allUsers = await User.find();

    if (allUsers.length === 0) {
      return res.status(404).json({ message: "There are no users." });
    }

     
    const usersWithImages = allUsers.map(user => {
      const profileImageBase64 = user.ProfileImage
        ? user.ProfileImage.toString('base64')  
        : null; // If no image, set to null

      return {
        username: user.Username,  
        profileImage: profileImageBase64  
      };
    });

     
    res.status(200).json({
      message: "All users retrieved successfully.",
      users: usersWithImages,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving users." });
  }
});*/
router.get("/allUsers", async (req, res) => {
  try {
    const allUsers = await User.aggregate([
      { $project: { Username: 1, ProfileImage: 1 } }, // Select only required fields
    ]);

    if (allUsers.length === 0) {
      return res.status(404).json({ message: "There are no users." });
    }
	 
    const usersWithImages = allUsers.map(user => ({
	  id:user._id,
      username: user.Username,
      profileImage: user.ProfileImage || null,  // Directly return the ImgBB URL
    }));

    res.status(200).json({
      message: "All users retrieved successfully.",
      users: usersWithImages,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving users." });
  }
});

module.exports = router;