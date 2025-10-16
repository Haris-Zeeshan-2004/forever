import express from "express";
const routers = express.Router();

import {
  addToCart,
  updatecart,
  gerUsercart,
} from "../Controllers/CartController.js";
import userAuth from "../Middleweres/userAuth.js";

routers.get("/get", userAuth, gerUsercart);
routers.put("/update", userAuth, updatecart);
routers.post("/add", userAuth, addToCart);

export default routers;
