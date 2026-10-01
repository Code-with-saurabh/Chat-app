const mongoose = require("mongoose");
const config = require("../config/env");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
        return false;
    }
};

module.exports = connectDB;
