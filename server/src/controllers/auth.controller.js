import { validationResult } from "express-validator";

import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";
import AppError from "../utils/app-error.js";

import {
    registerUser,
    loginUser,
} from "../services/auth.service.js";

export const register = asyncHandler(async (req, res , next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
    }

    const result = await registerUser(req.body);

    res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully",
            result
        )
    );
});

export const login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
    }

    const result = await loginUser(
        req.body.email,
        req.body.password
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Login successful",
            result
        )
    );
});