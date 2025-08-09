import express from "express";
import { authorization } from "../../middlewares/authorization.js";
import {
  adminAccessibility,
  editUserValidation,
} from "../../middlewares/adminMiddleware.js";
import { registerValidation } from "../../middlewares/authMiddleware.js";
import {
  createUserByAdmin,
  deleteUser,
  editUserByAdmin,
  getAllUsers,
} from "../../controllers/userController.js";
import { runValidation } from "../../middlewares/validator.js";

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

router.put(
  "/editUser/:id",
  authorization,
  adminAccessibility,
  editUserValidation,
  runValidation,
  editUserByAdmin
);

router.delete("/deleteUser/:id", authorization, adminAccessibility, deleteUser);

export default router;
