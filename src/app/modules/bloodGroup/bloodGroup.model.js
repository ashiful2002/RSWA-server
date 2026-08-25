const mongoose = require("mongoose");

const bloodGroupSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
    },
    Blood_Group: {
      type: String,
    },
    Phone: {
      type: String,
    },
    District: {
      type: String,
    },
    Upazila: {
      type: String,
    },
  },
  {
    strict: false, // allows any extra fields to be preserved
    timestamps: true,
  }
);

// Mongoose model mapped to 'BloodGroupCollection' collection in MongoDB
const BloodGroup = mongoose.model("BloodGroup", bloodGroupSchema, "BloodGroupCollection");

module.exports = BloodGroup;
