import jwt from "jsonwebtoken";
import  User  from "../models/userModel.js";

/* ==========================
   🔹 PROTECT (Auth Middleware)
   ========================== */
export const protect = async (req, res, next) => {
  let token;

  token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ success: false, message: "Invalid token, authorization denied" });
  }
};

/* ==========================
   🔹 ADMIN ONLY Middleware
   ========================== */
export const adminOnly = (req, res, next) => {
  console.log("Admin Middleware - User Data:", req.user);
  if (req.user && req.user.role.toLowerCase() === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied, Admins only" });
  }
};
