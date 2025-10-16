import jwt from "jsonwebtoken";

function userAuth(req, res, next) {
  const token = req.cookies.userToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token not found. Please login." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role || "user";
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
}

export default userAuth;
