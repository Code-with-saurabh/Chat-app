const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...", process.env.MONGO_URI);
        const conn = await mongoose.connect(process.env.MONGO_URI);


        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return true
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); // Stop server if DB fails
        return false
    }
};

module.exports = connectDB;
