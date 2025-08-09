import { body } from "express-validator";

export const adminAccessibility = (req, res, next) => {
  try {
    if (req.user?.role !== "ADMIN")
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required." });
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return res
      .status(500)
      .json({ message: "Server error during authorization check." });
  }
};

export const editUserValidation = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username should be at least 3 characters"),

  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain at least one special character"),

  body("role")
    .optional()
    .isIn(["USER", "ADMIN"])
    .withMessage("Role must be either USER or ADMIN"),
];
