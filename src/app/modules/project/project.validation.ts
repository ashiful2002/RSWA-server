import { z } from "zod";

const impactMetricsValidationSchema = z.object({
  beneficiaries: z.string().optional(),
  volunteersCount: z.number().optional(),
  location: z.string().optional(),
});

const createProjectValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        message: "Project title is required",
      })
      .min(1, "Project title cannot be empty"),
    slug: z.string().optional(),
    category: z.enum(
      ["Education", "Health", "Environment", "Relief", "Cultural"],
      {
        message: "Category is required",
      }
    ),
    status: z.enum(["Active", "Upcoming", "Completed"]).optional(),
    thumbnail: z
      .string({
        message: "Thumbnail URL is required",
      })
      .min(1, "Thumbnail URL cannot be empty"),
    summary: z
      .string({
        message: "Summary is required",
      })
      .min(1, "Summary cannot be empty"),
    description: z.string().optional(),
    impactMetrics: impactMetricsValidationSchema.optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

const updateProjectValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    category: z
      .enum(["Education", "Health", "Environment", "Relief", "Cultural"])
      .optional(),
    status: z.enum(["Active", "Upcoming", "Completed"]).optional(),
    thumbnail: z.string().optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    impactMetrics: impactMetricsValidationSchema.optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const projectValidation = {
  createProjectValidationSchema,
  updateProjectValidationSchema,
};
