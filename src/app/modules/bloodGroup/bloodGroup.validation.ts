import { z } from "zod";

const createBloodGroupValidationSchema = z.object({
  body: z.object({
    Timestamp: z.string().optional(),
    Name: z
      .string({
        message: "Name is required",
      })
      .min(1, { message: "Name cannot be empty" }),
    Blood_Group: z
      .string({
        message: "Blood Group is required",
      })
      .min(1, { message: "Blood Group cannot be empty" }),
    Phone_Number: z
      .string({
        message: "Phone Number is required",
      })
      .min(1, { message: "Phone Number cannot be empty" }),
    SSC_Batch: z.string().optional(),
    Permanent_Address: z.string().optional(),
    Present_Address: z.string().optional(),
    agree: z.boolean().optional(),
  }),
});

const updateBloodGroupValidationSchema = z.object({
  body: z.object({
    Timestamp: z.string().optional(),
    Name: z.string().optional(),
    Blood_Group: z.string().optional(),
    Phone_Number: z.string().optional(),
    SSC_Batch: z.string().optional(),
    Permanent_Address: z.string().optional(),
    Present_Address: z.string().optional(),
    present_address: z.string().optional(),
    permanent_address: z.string().optional(),
    agree: z.boolean().optional(),
    check_mark: z.boolean().optional(),
  }),
});

export const bloodGroupValidation = {
  createBloodGroupValidationSchema,
  updateBloodGroupValidationSchema,
};
