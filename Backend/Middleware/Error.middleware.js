const ApiError = require("../Utilities/ApiError");

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || [],
        });
    }

    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: [],
    });
};

module.exports = errorMiddleware;
