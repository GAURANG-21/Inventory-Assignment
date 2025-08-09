import express from "express";
import { authorization } from "../middlewares/authorization.js";
import {
  productValidation,
  runValidation,
  validateQuantity,
} from "../middlewares/productMiddleware.js";
import {
  addAProduct,
  updateProductQuantity,
} from "../controllers/productController.js";

const router = express.Router();

router.post(
  "/products",
  authorization,
  productValidation,
  runValidation,
  addAProduct
);

router.put(
  "/products/:id/quantity",
  authorization,
  validateQuantity,
  runValidation,
  updateProductQuantity
);

export default router;
