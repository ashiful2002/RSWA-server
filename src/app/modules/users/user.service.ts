import User from "./user.model";
import Property from "../properties/property.model";
import { IUser, TUserRole } from "./user.interface";

const getAllUsersFromDB = async () => {
  return await User.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
};

const getUserByEmailFromDB = async (email: string) => {
  const normalizedEmail = email.toLowerCase().trim();
  return await User.findOne({
    email: normalizedEmail,
    isDeleted: { $ne: true },
  });
};

const getUserRoleFromDB = async (email: string) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({
    email: normalizedEmail,
    isDeleted: { $ne: true },
  });

  if (!user) {
    return { role: "donor" as TUserRole };
  }
  return { role: user.role || "donor" };
};

const updateUserRoleInDB = async (email: string, role: TUserRole) => {
  const normalizedEmail = email.toLowerCase().trim();
  return await User.updateOne(
    { email: normalizedEmail, isDeleted: { $ne: true } },
    { $set: { role } }
  );
};

const markUserAsFraudInDB = async (email: string) => {
  const normalizedEmail = email.toLowerCase().trim();
  await User.updateOne(
    { email: normalizedEmail, isDeleted: { $ne: true } },
    { $set: { status: "fraud" } }
  );
  await Property.deleteMany({ agent_email: normalizedEmail });
  return { message: "Marked as fraud and properties removed" };
};

const updateUserInDB = async (email: string, updateData: Partial<IUser>) => {
  const normalizedEmail = email.toLowerCase().trim();
  return await User.updateOne(
    { email: normalizedEmail, isDeleted: { $ne: true } },
    { $set: updateData }
  );
};

const saveUserToDB = async (userData: IUser) => {
  if (!userData.email) {
    throw new Error("User email is required to save user");
  }

  const normalizedEmail = userData.email.toLowerCase().trim();
  userData.email = normalizedEmail;

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const updatePayload: Record<string, any> = {
      last_log_in: new Date().toISOString(),
      isDeleted: false,
    };

    if (userData.displayName) updatePayload.displayName = userData.displayName;
    if (userData.name) updatePayload.name = userData.name;
    if (userData.photoURL) updatePayload.photoURL = userData.photoURL;

    const result = await User.findOneAndUpdate(
      { email: normalizedEmail },
      { $set: updatePayload },
      { new: true }
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
  const normalizedEmail = email.toLowerCase().trim();
  return await User.updateOne(
    { email: normalizedEmail },
    { $set: { isDeleted: true } }
  );
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
