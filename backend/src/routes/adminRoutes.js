const adminController= require("../controllers/adminController")
const {protect,isAdmin} = require("../middleware/authMiddleware")

const express = require("express")
const router = express.Router()


router.get("/admin", protect, isAdmin, adminController.getAdmin )
router.get('/users',adminController.getAllUser)
router.post('/users',adminController.createUser)
router.put('/users/:id',adminController.updateUser)
router.delete('/users/:id',adminController.deleteUser)


module.exports = router

