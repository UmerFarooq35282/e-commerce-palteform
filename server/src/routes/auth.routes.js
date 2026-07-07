import express from "express";

import {
    register,
    login,
} from "../controllers/auth.controller.js";

import {
    registerValidation,
    loginValidation,
} from "../validators/auth.validation.js";
import { authRateLimiter } from "../middlewares/rate-limit.middleware.js";

const router = express.Router();

router.post("/register", authRateLimiter, registerValidation, register);

router.post("/login", authRateLimiter, loginValidation, login);

export default router;