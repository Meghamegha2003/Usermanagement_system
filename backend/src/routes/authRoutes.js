const express = require("express")
const router = express.Router()

const {registerUser,loginUser, getHome, getProfile, uploadProfileImage } = require("../controllers/authController")
const {protect, userOnly} = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadMiddleware")


router.post("/register",registerUser)
router.post('/login',loginUser)

router.get('/',protect,userOnly,getHome);
router.get('/profile',protect,userOnly,getProfile)
router.post("/profile/upload",protect,userOnly,upload.single("profileImage"),uploadProfileImage);

module.exports = router