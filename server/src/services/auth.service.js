import User from "../models/user.model.js";
import AppError from "../utils/app-error.js";
import { generateAccessToken } from "../utils/jwt.js";

export const registerUser = async (userData) => {
    // console.time("Find Existing User");
    const existingUser = await User.findOne({
        email: userData.email,
    });

    // console.timeEnd("Find Existing User");

    if (existingUser) {
        throw new AppError("Email already registered", 409);
    }

    // console.time("Create User");

    const user = await User.create(userData);

    // console.timeEnd("Create User");

    // console.time("Generate JWT");

    const accessToken = generateAccessToken({
        id: user._id,
        role: user.role,
    });

    // console.timeEnd("Generate JWT");

    return {
        user,
        accessToken: "test-token",
    };
};

export const loginUser = async (email, password) => {
    // console.time("Find User");

    const user = await User.findOne({ email }).select("+password");

    // console.timeEnd("Find User");

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    // console.time("Compare Password");

    const isPasswordCorrect = await user.comparePassword(password);

    // console.timeEnd("Compare Password");

    if (!isPasswordCorrect) {
        throw new AppError("Invalid email or password", 401);
    }

    user.lastLoginAt = new Date();
    await user.save();

    // console.time("Generate JWT");

    const accessToken = generateAccessToken({
        id: user._id,
        role: user.role,
    });

    // console.timeEnd("Generate JWT");

    return {
        user,
        accessToken,
    };
};