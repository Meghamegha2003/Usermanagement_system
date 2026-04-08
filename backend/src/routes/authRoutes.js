const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getHome,
  getProfile,
  updateProfile
} = require("../controllers/authController");

const { protect, userOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", protect, userOnly, getHome);
router.get("/profile", protect, userOnly, getProfile);

router.put("/profile", protect, userOnly, upload.single("profileImage"), updateProfile);

module.exports = router;