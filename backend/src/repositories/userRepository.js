const User = require("../models/userModel");

const createUser = async (userData) => {
  return await User.create(userData);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const getUser = async (search) => {
  const query = { role: "user" }
   if (search) {
    query.name = { $regex: search, $options: "i" }; 
  }
  return await User.find(query);
};

const createUserById = async (id) => {
  return await User.findById(id);
};

const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  createUser,
  findUserByEmail,
  getUser,
  createUserById,
  updateUser,
  deleteUser,
};
