const User = require("./user.model");
const Property = require("../properties/property.model");

const getAllUsersFromDB = async () => {
  return await User.find({ isDeleted: { $ne: true } });
};

const getUserByEmailFromDB = async (email) => {
  return await User.findOne({ email, isDeleted: { $ne: true } });
};

const getUserRoleFromDB = async (email) => {
  const user = await User.findOne({ email, isDeleted: { $ne: true } });

  if (!user) {
    return null;
  }
  return { role: user.role || "donor" };
};

const updateUserRoleInDB = async (email, role) => {
  return await User.updateOne(
    { email, isDeleted: { $ne: true } },
    { $set: { role } }
  );
};

const markUserAsFraudInDB = async (email) => {
  await User.updateOne(
    { email, isDeleted: { $ne: true } },
    { $set: { status: "fraud" } }
  );
  await Property.deleteMany({ agent_email: email });
  return { message: "Marked as fraud and properties removed" };
};

const updateUserInDB = async (email, updateData) => {
  return await User.updateOne(
    { email, isDeleted: { $ne: true } },
    { $set: updateData }
  );
};

const saveUserToDB = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    // update only the last log in and ensure isDeleted is false if user logs back in
    const result = await User.updateOne(
      { email: userData.email },
      {
        $set: {
          last_log_in: new Date().toISOString(),
          isDeleted: false,
        },
      }
    );
    return { message: "User log in updated", result };
  } else {
    // if new user - set timestamps and default isDeleted to false
    userData.created_at = new Date().toISOString();
    userData.last_log_in = new Date().toISOString();
    userData.isDeleted = false;

    const result = await User.create(userData);
    return { message: "New User created", result };
  }
};

const deleteUserFromDB = async (email) => {
  return await User.updateOne(
    { email },
    { $set: { isDeleted: true } }
  );
};

module.exports = {
  getAllUsersFromDB,
  getUserByEmailFromDB,
  getUserRoleFromDB,
  updateUserRoleInDB,
  markUserAsFraudInDB,
  updateUserInDB,
  saveUserToDB,
  deleteUserFromDB,
};
