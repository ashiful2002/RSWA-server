import mongoose from "mongoose";
import BloodGroup from "./bloodGroup.model";
import { IBloodGroup, IBloodGroupQueryParams } from "./bloodGroup.interface";

const cleanData = (obj: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => key && key.trim() !== "")
  );
};

const getBloodGroupsFromDB = async (queryParams: IBloodGroupQueryParams) => {
  const {
    search = "",
    bloodGroup = "",
    sortField = "Name",
    sortOrder = "asc",
    page = 1,
    limit = 20,
  } = queryParams;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const query = {
    $and: [
      {
        $or: [
          { Name: { $regex: search, $options: "i" } },
          { Blood_Group: { $regex: search, $options: "i" } },
        ],
      },
      ...(bloodGroup ? [{ Blood_Group: bloodGroup }] : []),
    ],
  };

  const total = await BloodGroup.countDocuments(query);

  const donors = await BloodGroup.find(query)
    .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  return {
    total,
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(total / limitNumber),
    data: donors,
  };
};

const updateBloodGroupInDB = async (id: string, updatedData: Partial<IBloodGroup>) => {
  console.log("id and data is coming", id, updatedData);

  updatedData = cleanData(updatedData);

  if (!updatedData || Object.keys(updatedData).length === 0) {
    const error: any = new Error("No data provided for update");
    error.statusCode = 400;
    throw error;
  }

  const result = await BloodGroup.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true }
  );

  if (!result) {
    const error: any = new Error("Donor not found");
    error.statusCode = 404;
    throw error;
  }

  return { message: "Donor updated successfully" };
};

const deleteBloodGroupFromDB = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error: any = new Error("Invalid donor ID");
    error.statusCode = 400;
    throw error;
  }

  const result = await BloodGroup.findByIdAndDelete(id);

  if (!result) {
    const error: any = new Error("Donor not found");
    error.statusCode = 404;
    throw error;
  }

  return { message: "Donor deleted successfully" };
};

const createBloodGroupInDB = async (data: IBloodGroup) => {
  const result = await BloodGroup.create(data);
  console.log(result);

  return { success: true, message: "Data saved", result };
};

export const bloodGroupService = {
  getBloodGroupsFromDB,
  updateBloodGroupInDB,
  deleteBloodGroupFromDB,
  createBloodGroupInDB,
};
