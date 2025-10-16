import express from "express";
import {
  AdminLogin,
  Login,
  Register,
  checkAuth,
  Logout,
  createotp,
  verifyEmail,
  sendResetOTP,
  resetPassword,
} from "../Controllers/UserController.js";
import userAuth from "../Middleweres/userAuth.js";

const router = express.Router();

router.post("/register", Register);

router.post("/login", Login);
router.post("/admin", AdminLogin);
router.get("/check-auth", checkAuth);
router.post("/logout", Logout);

router.post("/send-verify-otp", userAuth, createotp);
router.post("/verify-email", userAuth, verifyEmail);
router.post("/send-reset-otp", sendResetOTP);
router.post("/reset-password", resetPassword);

export default router;
