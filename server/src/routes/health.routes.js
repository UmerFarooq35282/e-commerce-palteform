import express from "express"
import { healthCheckController } from "../controllers/health.controller.js";

const router = express.Router();

router.get("/", healthCheckController)

export default router;