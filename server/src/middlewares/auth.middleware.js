import User from "../models/user.model.js";

import asyncHandler from "../utils/async-handler.js";
import AppError from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        throw new AppError("Authentication required", 401);
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new AppError("User not found", 401);
    }

    req.user = user;

    next();
});