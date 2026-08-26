import mongoose from "mongoose";
import BloodGroup from "./bloodGroup.model";
import { IBloodGroup, IBloodGroupQueryParams } from "./bloodGroup.interface";

const cleanData = (obj: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => key && key.trim() !== "")
  );
};

const getBloodGroupsFromDB = async (queryParams: IBloodGroupQueryParams) => {
  const {
    search = "",
    bloodGroup = "",
    Blood_Group = "",
    sortField = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 20,
    startDate,
    endDate,
  } = queryParams;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const targetBloodGroup = (bloodGroup || Blood_Group || "").trim();
  let bloodGroupCondition: Record<string, unknown> | null = null;

  if (targetBloodGroup) {
    const escaped = targetBloodGroup.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const flexiblePattern = escaped
      .replace(/\\\+/g, "[+\\s]")
      .replace(/ /g, "[+\\s]");
    bloodGroupCondition = {
      Blood_Group: { $regex: `^${flexiblePattern}$`, $options: "i" },
    };
  }

  // Date filtering logic that works for BOTH new and old data (using MongoDB ObjectId timestamp)
  const dateFilter: Record<string, unknown>[] = [];
  if (startDate || endDate) {
    const idCondition: Record<string, unknown> = {};
    const createdAtCondition: Record<string, unknown> = {};

    if (startDate) {
      const start = new Date(startDate);
      const startObjectId = mongoose.Types.ObjectId.createFromTime(
        Math.floor(start.getTime() / 1000)
      );
      idCondition["$gte"] = startObjectId;
      createdAtCondition["$gte"] = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      const endObjectId = mongoose.Types.ObjectId.createFromTime(
        Math.floor(end.getTime() / 1000)
      );
      idCondition["$lte"] = endObjectId;
      createdAtCondition["$lte"] = end;
    }

    dateFilter.push({
      $or: [{ _id: idCondition }, { createdAt: createdAtCondition }],
    });
  }

  const query = {
    $and: [
      {
        $or: [
          { Name: { $regex: search, $options: "i" } },
          { Blood_Group: { $regex: search, $options: "i" } },
          { Phone_Number: { $regex: search, $options: "i" } },
          // { Permanent_Address: { $regex: search, $options: "i" } },
          // { Present_Address: { $regex: search, $options: "i" } },
          // { SSC_Batch: { $regex: search, $options: "i" } },
        ],
      },
      ...(bloodGroupCondition ? [bloodGroupCondition] : []),
      ...dateFilter,
    ],
  };

  const total = await BloodGroup.countDocuments(query);

  const sortOptions: Record<string, 1 | -1> = {};
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  if (
    sortField === "createdAt" ||
    sortField === "created_at" ||
    sortField === "_id"
  ) {
    sortOptions["_id"] = sortDirection;
  } else {
    sortOptions[sortField] = sortDirection;
    sortOptions["_id"] = sortDirection;
  }

  const donors = await BloodGroup.find(query)
    .sort(sortOptions)
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

const updateBloodGroupInDB = async (
  id: string,
  updatedData: Partial<IBloodGroup>
) => {
  console.log("id and data is coming", id, updatedData);

  updatedData = cleanData(updatedData);

  if (!updatedData || Object.keys(updatedData).length === 0) {
    const error = new Error("No data provided for update") as Error & { statusCode?: number };
    error.statusCode = 400;
    throw error;
  }

  const result = await BloodGroup.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true }
  );

  if (!result) {
    const error = new Error("Donor not found") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }

  return { message: "Donor updated successfully" };
};

const deleteBloodGroupFromDB = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid donor ID") as Error & { statusCode?: number };
    error.statusCode = 400;
    throw error;
  }

  const result = await BloodGroup.findByIdAndDelete(id);

  if (!result) {
    const error = new Error("Donor not found") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }

  return { message: "Donor deleted successfully" };
};

const createBloodGroupInDB = async (data: IBloodGroup) => {
  if (!data.Timestamp) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes =
      now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
    data.Timestamp = `${month}/${day}/${year} ${hours}:${minutes}`;
  }

  const result = await BloodGroup.create(data);
  return result;
};

export const bloodGroupService = {
  getBloodGroupsFromDB,
  updateBloodGroupInDB,
  deleteBloodGroupFromDB,
  createBloodGroupInDB,
};
