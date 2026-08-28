export interface IStudentAward {
  _id?: string;
  nameEnglish: string;
  nameBangla: string;
  email: string;
  phoneNumber: string;
  session: "2025-26" | "2026-27" | string;
  university: string;
  sscSchool?: string;
  hscCollege?: string;
  submittedAt?: Date | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IStudentAwardQueryParams {
  search?: string;
  session?: string;
  university?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: number | string;
  limit?: number | string;
}
