const userService = require("./user.service");

const getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsersFromDB();
    res.send(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await userService.getUserByEmailFromDB(email);
    res.send(result);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getUserRole = async (req, res) => {
  try {
    const userEmail = req.params.email;
    const result = await userService.getUserRoleFromDB(userEmail);

    if (!result) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(result);
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { email } = req.params;
    const { role } = req.body;
    const result = await userService.updateUserRoleInDB(email, role);
    res.send(result);
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const markUserAsFraud = async (req, res) => {
  const { email } = req.params;
  try {
    const result = await userService.markUserAsFraudInDB(email);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = req.body;
    const result = await userService.updateUserInDB(email, updateData);
    res.send(result);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const createUser = async (req, res) => {
  const userData = req.body;

  try {
    const result = await userService.saveUserToDB(userData);
    return res.send(result);
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send({ error: "Failed to save user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;
    const result = await userService.deleteUserFromDB(email);
    res.send(result);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  getUserRole,
  updateUserRole,
  markUserAsFraud,
  updateUser,
  createUser,
  deleteUser,
};
