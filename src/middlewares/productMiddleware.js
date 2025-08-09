import { body, validationResult } from "express-validator";

export const productValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name must be at most 100 characters long"),

  body("type").trim().notEmpty().withMessage("Type is required"),

  body("sku").trim().notEmpty().withMessage("SKU is required").toUpperCase(),

  body("image_url")
    .trim()
    .notEmpty()
    .withMessage("Image URL is required")
    .isURL()
    .withMessage("Image URL must be a valid URL"),

  body("description").trim().notEmpty().withMessage("Description is required"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
];

export const validateQuantity = [
  body("quantity")
    .exists()
    .withMessage("Quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),
];

export const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
