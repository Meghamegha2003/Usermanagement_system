const express = require("express")
const router = express.Router()

const {registerUser,loginUser, getHome } = require("../controllers/authController")
const {protect} = require("../middleware/authMiddleware")


router.post("/register",registerUser)
router.post('/login',loginUser)

router.get('/',protect,getHome);


module.exports = router