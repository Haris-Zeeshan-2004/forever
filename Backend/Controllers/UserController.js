import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import usermodel from "../Models/UserModel.js";
import transport from "../Nodemailer/nodemailer.js";
import userModel from "../Models/UserModel.js";

export async function Register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(409).json({
        success: false,
        message: "Please enter a valid Email",
      });
    }
    if (password.length < 8) {
      return res.status(409).json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new usermodel({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: "user", email: newUser.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailoption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Forever Store",
      text: `welcome to Forever Store your account has been created with Email ${email}`,
    };
    await transport.sendMail(mailoption);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function Login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: "user", email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      userId: user._id,
      email: user.email,
      role: "user",
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function AdminLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { id: "admin", role: "admin", email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/admin",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials",
    });
  } catch (error) {
    console.error("AdminLogin Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function checkAuth(req, res) {
  try {
    const userToken = req.cookies.userToken;
    const adminToken = req.cookies.adminToken;

    if (!userToken && !adminToken) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    let decoded = null;
    let role = null;

    if (userToken) {
      decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
      role = "user";

      const user = await userModel.findById(decoded.id).select("-password");

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res.json({
        success: true,
        message: "Authenticated",
        user: { ...user._doc, role },
      });
    } else if (adminToken) {
      decoded = jwt.verify(adminToken, process.env.JWT_SECRET_KEY);
      role = "admin";
    }

    return res.json({
      success: true,
      message: "Authenticated",
      user: {
        id: decoded.id,
        email: decoded.email,
        role,
      },
    });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
}
export async function Logout(req, res) {
  try {
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/admin",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function createotp(req, res) {
  try {
    const userId = req.userId;
    const user = await usermodel.findById(userId);

    if (user.isAccountVerified) {
      res.json({ success: false, message: "user already verify" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyotp = otp;
    user.verifyotpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const mailoption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP ",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };
    await transport.sendMail(mailoption);
    res.json({ success: true, message: "Verification OTP send on Email" });
  } catch (error) {
    res.json({ message: error.message });
  }
}

export async function verifyEmail(req, res) {
  try {
    const userId = req.userId;
    const { otp } = req.body;

    if (!userId || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "userId and OTP are required" });
    }

    const user = await usermodel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.verifyotp || user.verifyotp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (!user.verifyotpExpireAt || user.verifyotpExpireAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    user.isAccountVerified = true;
    user.verifyotp = "";
    user.verifyotpExpireAt = null;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("verifyEmail error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}

export async function sendResetOTP(req, res) {
  try {
    const { email } = req.body;
    const user = await usermodel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetotp = otp;
    user.resetotpExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transport.sendMail(mailOption);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await usermodel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.resetotp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (!user.resetotpExpireAt || user.resetotpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetotp = "";
    user.resetotpExpireAt = 0;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}
