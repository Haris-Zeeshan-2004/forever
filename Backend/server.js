import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./Config/MongoDB.js";
import connectedCloundinary from "./Config/Cloudinary.js";
import userRouters from "./Routes/UserRoutes.js";
import ProductsRoutes from "./Routes/ProductsRoutes.js";
import CartRoutes from "./Routes/CartRoutes.js";
import OrderRoutes from "./Routes/OrderRoutes.js";
import AdminRoutes from "./Routes/AdminRoutes.js";
import SubRoutes from "./Routes/SubRoutes.js";

connectDB();
connectedCloundinary();

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "https://forever-admin-one-cyan.vercel.app"];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use("/api/user", userRouters);
app.use("/api/admin/products", ProductsRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/order", OrderRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/sub", SubRoutes);

app.get("/", (req, res) => {
  res.send("API is working fine");
});

export default (req, res) => {
  app(req, res);
};
