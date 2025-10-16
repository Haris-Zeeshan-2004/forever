import express from "express";
import upload from "../Middleweres/Multer.js";
import { AdminAuth } from "../Middleweres/AdminAuth.js";
import {
  AddProduct,
  RemoveProduct,
  GetAdminProducts,
  GetSingleProduct,
  ListAllProducts,
  UpdateProduct,
} from "../Controllers/ProductsController.js";

const router = express.Router();

router.post(
  "/add",
  AdminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  AddProduct
);

router.get("/my-products", AdminAuth, GetAdminProducts);

router.put("/update/:id", AdminAuth, UpdateProduct);

router.delete("/remove/:id", AdminAuth, RemoveProduct);

router.get("/single/:id", GetSingleProduct);
router.get("/all", ListAllProducts);

export default router;
