import { z } from "zod";

const committeeSocialValidationSchema = z.object({
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  facebook: z.string().optional(),
  email: z.string().optional(),
});

const createCommitteeValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        message: "Name is required",
      })
      .min(1, "Name cannot be empty"),
    title: z
      .string({
        message: "Title/Designation is required",
      })
      .min(1, "Title cannot be empty"),
    image: z
      .string({
        message: "Image URL is required",
      })
      .min(1, "Image URL cannot be empty"),
    session: z.string().optional(),
    says: z.string().optional(),
    social: committeeSocialValidationSchema.optional(),
    order: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateCommitteeValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    title: z.string().min(1, "Title cannot be empty").optional(),
    image: z.string().min(1, "Image URL cannot be empty").optional(),
    session: z.string().optional(),
    says: z.string().optional(),
    social: committeeSocialValidationSchema.optional(),
    order: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const committeeValidation = {
  createCommitteeValidationSchema,
  updateCommitteeValidationSchema,
};
