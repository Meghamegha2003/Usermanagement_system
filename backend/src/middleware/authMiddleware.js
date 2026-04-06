const jwt = require("jsonwebtoken")
const status = require("../utils/statusCodes")

const protect =  (req,res,next)=>{
    try {
        const authHeader =  req.headers.authorization
        if(!authHeader){
           return res.status(status.BAD_REQUEST).json({message:"No token"})
        }
        const token =  authHeader.split(" ")[1]
         if (!token) {
      return res.status(status.UNAUTHORIZED).json({ message: "Invalid token format" });
    }
        const decoded =  jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
       return res.status(status.SERVER_ERROR).json({message:error.message})
    }
}

const isAdmin = async (req,res,next)=>{
    try {
        if(req.user.role != "admin"){
           return res.status(status.FORBIDDEN).json({message:"Admin only"})
        }
        next()
    } catch (error) {
       return res.status(status.SERVER_ERROR).json({message:error.message})
    }
}

module.exports={
    protect,
    isAdmin
}