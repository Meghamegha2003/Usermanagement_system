const status = require("../utils/statusCodes");
const authUsecase = require("../usecases/authUsecase");

const registerUser = async (req, res) => {
  try {
    const result = await authUsecase.registerUser(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(status.SERVER_ERROR).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await authUsecase.loginUser(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(status.SERVER_ERROR).json({ success: false, message: error.message });
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
    return res.status(status.SERVER_ERROR).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(status.NOT_FOUND).json({ success: false, message: "User not found" });
    }

    return res.status(status.SUCCESS).json({
      success: true,
      message: "Profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    return res.status(status.SERVER_ERROR).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await authUsecase.updateProfile({
      userId: req.user._id,
      name,
      email,
      profileImageFile: req.file,
    });

    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(status.SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getHome,
  getProfile,
  updateProfile,
};