const User = require("../models/userModel");

const createUser = async (userData) => {
  return await User.create(userData);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserById = async (id) => {
  return await User.findById(id).select("-password");
};

const getUser = async (search) => {
  const query = { role: "user" }; 
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  return await User.find(query).select("-password");
};

const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getUser,
  updateUser,
  deleteUser,
};