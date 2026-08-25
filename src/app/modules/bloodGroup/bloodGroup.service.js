const mongoose = require("mongoose");
const BloodGroup = require("./bloodGroup.model");

const cleanData = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => key && key.trim() !== "")
  );
};

const getBloodGroupsFromDB = async (queryParams) => {
  const {
    search = "",
    bloodGroup = "",
    sortField = "Name",
    sortOrder = "asc",
    page = 1,
    limit = 20,
  } = queryParams;

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
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    data: donors,
  };
};

const updateBloodGroupInDB = async (id, updatedData) => {
  console.log("id and data is coming", id, updatedData);

  // Clean data to remove empty keys
  updatedData = cleanData(updatedData);

  if (!updatedData || Object.keys(updatedData).length === 0) {
    const error = new Error("No data provided for update");
    error.statusCode = 400;
    throw error;
  }

  const result = await BloodGroup.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true }
  );

  if (!result) {
    const error = new Error("Donor not found");
    error.statusCode = 404;
    throw error;
  }

  return { message: "Donor updated successfully" };
};

const deleteBloodGroupFromDB = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid donor ID");
    error.statusCode = 400;
    throw error;
  }

  const result = await BloodGroup.findByIdAndDelete(id);

  if (!result) {
    const error = new Error("Donor not found");
    error.statusCode = 404;
    throw error;
  }

  return { message: "Donor deleted successfully" };
};

const createBloodGroupInDB = async (data) => {
  const result = await BloodGroup.create(data);
  console.log(result);

  return { success: true, message: "Data saved", result };
};

module.exports = {
  getBloodGroupsFromDB,
  updateBloodGroupInDB,
  deleteBloodGroupFromDB,
  createBloodGroupInDB,
};
