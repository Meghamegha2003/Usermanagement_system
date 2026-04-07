const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const status = require("../utils/statusCodes");

const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    return {
      status: status.BAD_REQUEST,
      success: false,
      message: "All fields required",
    };
  }

  const userExist = await userRepository.findUserByEmail(email);
  if (userExist) {
    return {
      status: status.BAD_REQUEST,
      success: false,
      message: "User already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
  });

  return {
    status: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    return {
      status: status.BAD_REQUEST,
      success: false,
      message: "All fields required",
    };
  }

  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    return {
      status: status.BAD_REQUEST,
      success: false,
      message: "User not exist",
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return {
      status: status.BAD_REQUEST,
      success: false,
      message: "Invalid credentials",
    };
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    status: status.SUCCESS,
    success: true,
    message: "Login successful",
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};