import express from "express";
import {
  loginValidation,
  registerValidation,
} from "../middlewares/authMiddleware.js";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/authController.js";
import { runValidation } from "../middlewares/validator.js";

const router = express.Router();

router.post("/register", registerValidation, runValidation, registerUser);
router.post("/login", loginValidation, runValidation, loginUser);
router.post("/refresh-token", refreshAccessToken);

export default router;
