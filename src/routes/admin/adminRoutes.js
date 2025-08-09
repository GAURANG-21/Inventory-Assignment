import express from "express";
import { authorization } from "../../middlewares/authorization.js";
import { adminAccessibility } from "../../middlewares/adminMiddleware.js";
import {
  registerValidation,
  runValidation,
} from "../../middlewares/authMiddleware.js";
import { createUserByAdmin, getAllUsers } from "../../controllers/userController.js";

const router = express.Router();

router.get("/getUsers", authorization, adminAccessibility, getAllUsers);
router.post(
  "/createUser",
  authorization,
  adminAccessibility,
  registerValidation,
  runValidation,
  createUserByAdmin
);

export default router;
