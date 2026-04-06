

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const status = require("../utils/statusCodes");

const registerUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
     return res.status(status.BAD_REQUEST).json({ message: "All feild required" });
    }
    if (password != confirmPassword) {
     return res.status(status.BAD_REQUEST).json({ message: "Password not matching" });
    }
    const userExist = await userRepository.findByEmail({ email });
    if (userExist) {
     return res.status(status.BAD_REQUEST).json({ message: "user is alredy exist" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.createUser ({
      name,
      email,
      password: hashPassword,
    });

    return res.status(status.CREATED).json({
      message: "user Registered",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(status.BAD_REQUEST).json({ message: "All feild requiered" });
    }
    const user = await userRepository.findByEmail({ email });
    if (!user) {
      return res.status(status.BAD_REQUEST).json({ message: "user not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(status.BAD_REQUEST).json({ message: "Invalid cridential" });
    }

    const token = jwt.sign(
        {id:user._id,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    return res.status(status.SUCCESS).json({message:"Login successful",token})
};

module.exports = {
    registerUser,
    loginUser
}