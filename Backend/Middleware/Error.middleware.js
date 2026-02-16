const ApiError = require("../Utilities/ApiError");

const errorMiddleware = (err, req, res, next) => {
    // Agar error ApiError hai
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || [],
        });
    }

    // Agar koi unknown / system error hai
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: [],
    });
};

module.exports = errorMiddleware;
