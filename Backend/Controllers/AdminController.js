import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import transport from "../Nodemailer/nodemailer.js";
import adminModel from "../Models/AdminModel.js";

const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
};

const setAdminCookie = (res, token) => {
  res.cookie("adminToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export async function adminRegister(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });

    if (!validator.isEmail(email))
      return res.status(400).json({ success: false, message: "Invalid email" });

    if (password.length < 8)
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });

    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin)
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await adminModel.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    const token = generateToken(newAdmin);
    setAdminCookie(res, token);

    await transport.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Forever Store (Admin Access)",
      text: `Welcome ${name}, your admin account has been created.`,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      adminId: newAdmin._id,
      role: newAdmin.role,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });

    const admin = await adminModel.findOne({ email });
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = generateToken(admin);
    setAdminCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      adminId: admin._id,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export async function checkAuth(req, res) {
  try {
    const token = req.cookies?.adminToken;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const admin = await adminModel.findById(decoded.id).select("-password");
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });

    return res
      .status(200)
      .json({ success: true, message: "Authenticated", admin });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
}

export async function adminLogout(req, res) {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export async function createOtp(req, res) {
  try {
    const token = req.cookies?.adminToken;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const admin = await adminModel.findById(decoded.id);
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });

    if (admin.isAccountVerified)
      return res.json({ success: false, message: "Admin already verified" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.verifyotp = otp;
    admin.verifyotpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await admin.save();

    await transport.sendMail({
      from: process.env.SENDER_EMAIL,
      to: admin.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. It expires in 24 hours.`,
    });

    res.json({ success: true, message: "Verification OTP sent to email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function verifyEmail(req, res) {
  try {
    const token = req.cookies?.adminToken;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { otp } = req.body;
    const admin = await adminModel.findById(decoded.id);
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });

    if (admin.verifyotp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (admin.verifyotpExpireAt < Date.now())
      return res.status(400).json({ success: false, message: "OTP expired" });

    admin.isAccountVerified = true;
    admin.verifyotp = "";
    admin.verifyotpExpireAt = 0;
    await admin.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function sendResetOTP(req, res) {
  try {
    const { email } = req.body;
    const admin = await adminModel.findOne({ email });
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetotp = otp;
    admin.resetotpExpireAt = Date.now() + 10 * 60 * 1000;
    await admin.save();

    await transport.sendMail({
      from: process.env.SENDER_EMAIL,
      to: admin.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    const admin = await adminModel.findOne({ email });
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });

    if (admin.resetotp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (admin.resetotpExpireAt < Date.now())
      return res.status(400).json({ success: false, message: "OTP expired" });

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetotp = "";
    admin.resetotpExpireAt = 0;
    await admin.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
