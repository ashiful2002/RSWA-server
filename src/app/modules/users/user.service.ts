import User from "./user.model";
import Property from "../properties/property.model";
import { IUser, TUserRole } from "./user.interface";

const getAllUsersFromDB = async () => {
  return await User.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
};

const getUserByEmailFromDB = async (email: string) => {
  return await User.findOne({ email, isDeleted: { $ne: true } });
};

const getUserRoleFromDB = async (email: string) => {
  const user = await User.findOne({ email, isDeleted: { $ne: true } });

  if (!user) {
    return null;
  }
  return { role: user.role || "donor" };
};

const updateUserRoleInDB = async (email: string, role: TUserRole) => {
  return await User.updateOne(
    { email, isDeleted: { $ne: true } },
    { $set: { role } }
  );
};

const markUserAsFraudInDB = async (email: string) => {
  await User.updateOne(
    { email, isDeleted: { $ne: true } },
    { $set: { status: "fraud" } }
  );
  await Property.deleteMany({ agent_email: email });
  return { message: "Marked as fraud and properties removed" };
};

const updateUserInDB = async (email: string, updateData: Partial<IUser>) => {
  return await User.updateOne(
    { email, isDeleted: { $ne: true } },
    { $set: updateData }
  );
};

const saveUserToDB = async (userData: IUser) => {
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    const updatePayload: Record<string, any> = {
      last_log_in: new Date().toISOString(),
      isDeleted: false,
    };

    if (userData.displayName) updatePayload.displayName = userData.displayName;
    if (userData.name) updatePayload.name = userData.name;
    if (userData.photoURL) updatePayload.photoURL = userData.photoURL;

    const result = await User.updateOne(
      { email: userData.email },
      { $set: updatePayload }
    );
    return { message: "User log in updated", result };
  } else {
    userData.created_at = new Date().toISOString();
    userData.last_log_in = new Date().toISOString();
    userData.isDeleted = false;
    if (!userData.role) {
      userData.role = "donor";
    }

    const result = await User.create(userData);
    return { message: "New User created", result };
  }
};

const deleteUserFromDB = async (email: string) => {
  return await User.updateOne({ email }, { $set: { isDeleted: true } });
};

export const userService = {
  getAllUsersFromDB,
  getUserByEmailFromDB,
  getUserRoleFromDB,
  updateUserRoleInDB,
  markUserAsFraudInDB,
  updateUserInDB,
  saveUserToDB,
  deleteUserFromDB,
};
