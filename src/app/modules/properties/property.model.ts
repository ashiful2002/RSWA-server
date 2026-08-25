import { Schema, model } from "mongoose";

export interface IProperty {
  agent_email?: string;
}

const propertySchema = new Schema<IProperty>(
  {
    agent_email: {
      type: String,
    },
  },
  {
    strict: false,
  }
);

const Property = model<IProperty>("Property", propertySchema, "properties");

export default Property;
