import asyncHandler from "../utils/async-handler.js";

export const healthCheckController = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});