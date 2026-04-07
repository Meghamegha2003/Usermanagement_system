const jwt = require("jsonwebtoken");
const status = require("../utils/statusCodes");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(status.UNAUTHORIZED).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(status.UNAUTHORIZED).json({ message: "Invalid token format" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(status.UNAUTHORIZED).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(status.UNAUTHORIZED).json({ message: "Not authorized" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(status.FORBIDDEN).json({ message: "Admin only" });
    }
    next();
  } catch (error) {
    return res.status(status.SERVER_ERROR).json({ message: error.message });
  }
};

const userOnly = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Users only" });
  }
  next();
};

module.exports = {
  protect,
  isAdmin,
  userOnly
};