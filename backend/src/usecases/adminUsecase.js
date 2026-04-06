const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const status = require("../utils/statusCodes");


const getAllUser = async(search)=>{
 const users = await userRepository.getUser(search)
 return {status:status.SUCCESS,users}
}

const createUser = async({name,email,password})=>{
    if(!name || !email || !password){
        return {status:status.BAD_REQUEST,message:"Required all feild"}
    }
    const userExist = await userRepository.findUserByEmail(email)
    if(userExist){
        return {status:status.BAD_REQUEST,message:"user alredy exist"}
    }
    const hashPassword = await bcrypt.hash(password,10)
    const user = await userRepository.createUser({
        name,
        email,
        password:hashPassword
    })
    return {status:status.CREATED,message:"user created" , user}
}

const updateUser = async (id,{name,email,password})=>{
    const updatedData = {name,email,password}
    if(password){
        updatedData.password = await bcrypt.hash(password,10)
    }
    const user = await userRepository.updateUser(id,updateData)
    return {status:status.SUCCESS,message:"Updated the user",user}
}

const deleteUser = async (id)=>{
    await userRepository.deleteUser(id)
    return {status:status.SUCCESS,message:"User Deleted "}
}

module.exports = {
    getAllUser,
    createUser,
    updateUser,
    deleteUser
}