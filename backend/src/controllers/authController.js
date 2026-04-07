const status = require("../utils/statusCodes");
const authUsecase = require("../usecases/authUsecase");
const cloudinary = require("../config/cloudinary");
const User = require("../models/userModel");


const registerUser = async (req, res) => {
  try {
    const result = await authUsecase.registerUser(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(status.SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await authUsecase.loginUser(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(status.SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getHome = async (req, res) => {
  try {
    return res.status(status.SUCCESS).json({
      success: true,
      message: "Welcome to Home page",
      user: req.user || null,
    });
  } catch (error) {
    return res.status(status.SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  // console.log(req.user)
  try {
    if (!req.user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(status.BAD_REQUEST)
        .json({ success: false, message: "No file uploaded" });

    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(status.NOT_FOUND)
        .json({ success: false, message: "User not found" });

    // Delete old image from Cloudinary if exists
    if (user.profileImage) {
      const publicId = user.profileImage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`profile_images/${publicId}`);
    }

    user.profileImage = req.file.path; 
    await user.save();

    return res
      .status(status.SUCCESS)
      .json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    return res
      .status(status.SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getHome,
  getProfile,
  uploadProfileImage
};