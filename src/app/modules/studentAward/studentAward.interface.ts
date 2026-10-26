export interface IStudentAward {
  _id?: string;
  nameEnglish: string;
  nameBangla: string;
  email: string;
  phoneNumber: string;
  session?: string;
  hscPassingYear?: string;
  sscPassingYear?: string;
  university?: string;
  sscSchool?: string;
  hscCollege?: string;
  instituteName?: string;
  presentCollege?: string;
  sscBatch?: string;
  awardType?: "admission" | "hsc" | "ssc" | string;
  submittedAt?: Date | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IStudentAwardQueryParams {
  search?: string;
  session?: string;
  hscPassingYear?: string;
  university?: string;
  awardType?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: number | string;
  limit?: number | string;
}
