import AppError from "../utils/app-error.js"

export const healthCheckController = (req, res) => {
    // res.json({
    //     "success": true,
    //     "message": "Server is running",
    //     "timestamp": "...",
    //     "environment": "development"
    // })
    throw new AppError("Health endpoint failed" , 500)

}