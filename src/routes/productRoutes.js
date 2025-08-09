import express from "express";
import { authorization } from "../middlewares/authorization.js";
import {
  productValidation,
  validateQuantity,
} from "../middlewares/productMiddleware.js";
import {
  addAProduct,
  getProducts,
  updateProductQuantity,
} from "../controllers/productController.js";
import { runValidation } from "../middlewares/validator.js";

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

router.get("/products", getProducts);

export default router;
