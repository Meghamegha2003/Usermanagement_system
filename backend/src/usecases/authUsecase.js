const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const status = require("../utils/statusCodes");
const cloudinary = require("../config/cloudinary");

const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    return { status: status.BAD_REQUEST, success: false, message: "All fields required" };
  }

  const userExist = await userRepository.findUserByEmail(email);
  if (userExist) {
    return { status: status.BAD_REQUEST, success: false, message: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
  });

  return {
    status: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: { id: user._id, name: user.name, email: user.email },
  };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    return { status: status.BAD_REQUEST, success: false, message: "All fields required" };
  }

  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    return { status: status.BAD_REQUEST, success: false, message: "User not exist" };
  }

  
 if (user.role === "admin") {
    return { status: status.FORBIDDEN, success: false, message: "Admins cannot log in from user portal" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { status: status.BAD_REQUEST, success: false, message: "Invalid credentials" };
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    status: status.SUCCESS,
    success: true,
    message: "Login successful",
    token,
    data: { id: user._id, name: user.name, email: user.email },
  };
};

const updateProfile = async ({ userId, name, email, profileImageFile }) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    return { status: status.NOT_FOUND, success: false, message: "User not found" };
  }

  const updates = {};

  if (name) updates.name = name;

  if (email) {
    const existing = await userRepository.findUserByEmail(email);
    if (existing && existing._id.toString() !== userId) {
      return { status: status.BAD_REQUEST, success: false, message: "Email already in use" };
    }
    updates.email = email;
  }

  if (profileImageFile) {
    if (user.profileImage) {
      const publicId = user.profileImage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`profile_images/${publicId}`);
    }

    const uploaded = await cloudinary.uploader.upload(profileImageFile.path, {
      folder: "profile_images",
    });

    updates.profileImage = uploaded.secure_url;
  }

  if (Object.keys(updates).length === 0) {
    return { status: status.BAD_REQUEST, success: false, message: "No data to update" };
  }

  const updatedUser = await userRepository.updateUser(userId, updates);

  return {
    status: status.SUCCESS,
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  };
};

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
};