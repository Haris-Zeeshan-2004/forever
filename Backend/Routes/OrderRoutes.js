import express from "express";
import {
  OrderPlace,
  AllOrders,
  UserOrders,
  UpdateStatus,
} from "../Controllers/OrderController.js";
import { AdminAuth } from "../Middleweres/AdminAuth.js";
import userAuth from "../Middleweres/userAuth.js";

const routers = express.Router();

routers.get("/list", AdminAuth, AllOrders);
routers.put("/status", AdminAuth, UpdateStatus);

routers.post("/place", userAuth, OrderPlace);
routers.get("/userorders", userAuth, UserOrders);

export default routers;
