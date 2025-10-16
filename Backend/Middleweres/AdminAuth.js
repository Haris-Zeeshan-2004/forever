import jwt from "jsonwebtoken";
import adminModel from "../Models/AdminModel.js";

export const AdminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    if (!token)
      return res.status(401).json({ success: false, message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.role !== "admin")
      return res.status(403).json({ success: false, message: "Access denied" });

    const admin = await adminModel.findById(decoded.id);
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });

    req.admin = admin;
    req.userId = admin._id;
    req.userRole = admin.role;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
