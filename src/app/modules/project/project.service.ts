import mongoose from "mongoose";
import Project from "./project.model";
import { IProject, IProjectQueryParams } from "./project.interface";

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const generateUniqueSlug = async (
  title: string,
  excludeId?: string
): Promise<string> => {
  const baseSlug = slugify(title) || "project";
  let slug = baseSlug;
  let count = 0;

  while (true) {
    const existing = await Project.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });

    if (!existing) {
      return slug;
    }

    count += 1;
    slug = `${baseSlug}-${count}`;
  }
};

const createProjectInDB = async (payload: IProject) => {
  if (!payload.slug || payload.slug.trim() === "") {
    payload.slug = await generateUniqueSlug(payload.title);
  } else {
    payload.slug = slugify(payload.slug);
    const existing = await Project.findOne({ slug: payload.slug });
    if (existing) {
      payload.slug = await generateUniqueSlug(payload.slug);
    }
  }

  const result = await Project.create(payload);
  return result;
};

const getAllProjectsFromDB = async (queryParams: IProjectQueryParams) => {
  const {
    search = "",
    category = "",
    status = "",
    sortField = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 9,
  } = queryParams;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const andConditions: Record<string, unknown>[] = [];

  if (search.trim()) {
    const searchRegex = { $regex: search.trim(), $options: "i" };
    andConditions.push({
      $or: [
        { title: searchRegex },
        { slug: searchRegex },
        { summary: searchRegex },
        { description: searchRegex },
        { "impactMetrics.location": searchRegex },
      ],
    });
  }

  if (category.trim()) {
    andConditions.push({ category: category.trim() });
  }

  if (status.trim()) {
    andConditions.push({ status: status.trim() });
  }

  const query = andConditions.length > 0 ? { $and: andConditions } : {};

  const total = await Project.countDocuments(query);

  const sortDirection = sortOrder === "asc" ? -1 : 1;
  const sortOptions: Record<string, 1 | -1> = {
    [sortField]: sortDirection,
  };
  if (sortField !== "_id") {
    sortOptions["_id"] = sortDirection;
  }

  const projects = await Project.find(query)
    .sort(sortOptions)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  return {
    total,
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(total / limitNumber),
    data: projects,
  };
};

const getSingleProjectFromDB = async (idOrSlug: string) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
  const query = isObjectId
    ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] }
    : { slug: idOrSlug };

  const project = await Project.findOne(query);
  if (!project) {
    const error = new Error("Project not found") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }

  return project;
};

const updateProjectInDB = async (id: string, payload: Partial<IProject>) => {
  if (payload.title && !payload.slug) {
    payload.slug = await generateUniqueSlug(payload.title, id);
  } else if (payload.slug) {
    payload.slug = slugify(payload.slug);
    const existing = await Project.findOne({
      slug: payload.slug,
      _id: { $ne: id },
    });
    if (existing) {
      payload.slug = await generateUniqueSlug(payload.slug, id);
    }
  }

  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  const filter = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };

  const result = await Project.findOneAndUpdate(
    filter,
    { $set: payload },
    { new: true, runValidators: true }
  );

  if (!result) {
    const error = new Error("Project not found") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }

  return result;
};

const deleteProjectFromDB = async (idOrSlug: string) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
  const filter = isObjectId
    ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] }
    : { slug: idOrSlug };

  const result = await Project.findOneAndDelete(filter);
  if (!result) {
    const error = new Error("Project not found") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }

  return result;
};

export const projectService = {
  createProjectInDB,
  getAllProjectsFromDB,
  getSingleProjectFromDB,
  updateProjectInDB,
  deleteProjectFromDB,
};
