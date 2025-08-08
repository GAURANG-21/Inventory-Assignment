import express from "express";
import {
  registerValidation,
  runValidation,
} from "../middlewares/authMiddleware.js";
import { registerUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerValidation, runValidation, registerUser);

export default router;
