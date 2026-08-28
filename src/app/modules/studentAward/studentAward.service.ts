import StudentAward from "./studentAward.model";
import {
  IStudentAward,
  IStudentAwardQueryParams,
} from "./studentAward.interface";

const createStudentAwardSubmissionInDB = async (payload: IStudentAward) => {
  const result = await StudentAward.create(payload);
  return result;
};

const getAllStudentAwardSubmissionsFromDB = async (
  queryParams: IStudentAwardQueryParams
) => {
  const {
    search = "",
    session = "",
    university = "",
    sortField = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = queryParams;

  const pageNumber = Math.max(1, Number(page));
  const limitNumber = Math.max(1, Number(limit));

  const andConditions: Record<string, unknown>[] = [];

  if (search.trim()) {
    const searchRegex = { $regex: search.trim(), $options: "i" };
    andConditions.push({
      $or: [
        { nameEnglish: searchRegex },
        { nameBangla: searchRegex },
        { email: searchRegex },
        { phoneNumber: searchRegex },
        { university: searchRegex },
        { sscSchool: searchRegex },
        { hscCollege: searchRegex },
      ],
    });
  }

  if (session.trim()) {
    andConditions.push({ session: session.trim() });
  }

  if (university.trim()) {
    andConditions.push({
      university: { $regex: university.trim(), $options: "i" },
    });
  }

  const query = andConditions.length > 0 ? { $and: andConditions } : {};

  const total = await StudentAward.countDocuments(query);

  const sortDirection = sortOrder === "asc" ? 1 : -1;
  const sortOptions: Record<string, 1 | -1> = {
    [sortField]: sortDirection,
  };
  if (sortField !== "_id") {
    sortOptions["_id"] = sortDirection;
  }

  const submissions = await StudentAward.find(query)
    .sort(sortOptions)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  return {
    total,
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(total / limitNumber),
    data: submissions,
  };
};

const getSingleStudentAwardSubmissionFromDB = async (id: string) => {
  const submission = await StudentAward.findById(id);
  if (!submission) {
    const error = new Error("Submission not found") as Error & {
      statusCode?: number;
    };
    error.statusCode = 404;
    throw error;
  }
  return submission;
};

const deleteStudentAwardSubmissionFromDB = async (id: string) => {
  const result = await StudentAward.findByIdAndDelete(id);
  if (!result) {
    const error = new Error("Submission not found") as Error & {
      statusCode?: number;
    };
    error.statusCode = 404;
    throw error;
  }
  return result;
};



export const studentAwardService = {
  createStudentAwardSubmissionInDB,
  getAllStudentAwardSubmissionsFromDB,
  getSingleStudentAwardSubmissionFromDB,
  deleteStudentAwardSubmissionFromDB,
};
