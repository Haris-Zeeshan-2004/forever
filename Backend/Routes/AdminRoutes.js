import express from "express";
import {
  adminLogin,
  adminRegister,
  checkAuth,
  adminLogout,
  createOtp,
  verifyEmail,
  sendResetOTP,
  resetPassword,
} from "../Controllers/AdminController.js";
import { AdminAuth } from "../Middleweres/AdminAuth.js";

const router = express.Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.get("/check-auth", AdminAuth, checkAuth);
router.post("/logout", AdminAuth, adminLogout);

router.post("/send-verify-otp", AdminAuth, createOtp);
router.post("/verify-email", AdminAuth, verifyEmail);

router.post("/send-reset-otp", sendResetOTP);
router.post("/reset-password", resetPassword);

export default router;
