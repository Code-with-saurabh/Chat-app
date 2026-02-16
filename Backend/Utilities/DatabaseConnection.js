const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        
        console.log(`MongoDB Connected: ${conn.connections.host}`);
        return true
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); // Stop server if DB fails
        return false
    }
};

module.exports = connectDB;
