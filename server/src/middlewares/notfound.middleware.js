import AppError from "../utils/app-error.js";

export const notfoundError = (req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404))
}