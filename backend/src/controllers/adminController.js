const adminUsecase = require("../usecases/adminUsecase");
const status = require("../utils/statusCodes");

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await adminUsecase.loginAdmin(email, password);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAdmin = async (req, res) => {
  try {
    res.status(status.SUCCESS).json({
      message: "Welcome to Admin page",
    });
  } catch (error) {
    res.status(status.SERVER_ERROR).json({ message: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const search = req.query.search || "";
    const result = await adminUsecase.getAllUser(search);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(status.SERVER_ERROR).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const result = await adminUsecase.createUser(req.body);
    return res.status(result.status).json({ result });
  } catch (error) {
    res.status(status.SERVER_ERROR).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await adminUsecase.updateUser(id, req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    res.status(status.SERVER_ERROR).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await adminUsecase.deleteUser(id);
    return res.status(result.status).json(result);
  } catch (error) {
    res.status(status.SERVER_ERROR).json({ message: error.message });
  }
};

module.exports = {
  getAdmin,
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
  loginAdmin
};
