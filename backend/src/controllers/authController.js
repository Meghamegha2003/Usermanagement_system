const status = require("../utils/statusCodes");
const authUsecase = require("../usecases/authUsecase");

const registerUser = async (req, res) => {
  try {
    const result = await authUsecase.registerUser(req.body);
    return res.status(result.status).json({ result });
  } catch (error) {
    return res.status(status.SERVER_ERROR).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await authUsecase.loginUser(req.body);
    return res.status(result.status).json({ result });
  } catch (error) {
    return res.status(status.SERVER_ERROR).json({ message: error.message });
  }
};

const getHome = async (req, res) => {
  try {
    res.status(status.SUCCESS).json({
      message: "Welcone to Home page",
      user: req.user || null,
    });
  } catch (error) {
    res.status(status.SERVER_ERROR).json({ message: error.message });
  }
};



module.exports = {
  registerUser,
  loginUser,
  getHome,
};
