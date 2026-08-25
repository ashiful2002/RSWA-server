const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    agent_email: {
      type: String,
    },
  },
  {
    strict: false,
  }
);

const Property = mongoose.model("Property", propertySchema, "properties");

module.exports = Property;
