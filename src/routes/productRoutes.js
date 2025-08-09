import express from "express";
import { authorization } from "../middlewares/authorization.js";
import {
  productValidation,
  runValidation,
} from "../middlewares/productMiddleware.js";
import { addAProduct } from "../controllers/productController.js";

const router = express.Router();

router.post(
  "/products",
  authorization,
  productValidation,
  runValidation,
  addAProduct
);

export default router;
