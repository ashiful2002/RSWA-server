export interface IBloodGroup {
  _id?: string;
  Timestamp?: string;
  Name: string;
  Blood_Group: string;
  Phone_Number: string;
  SSC_Batch: string;
  Permanent_Address?: string;
  Present_Address?: string;
  present_address?: string;
  permanent_address?: string;
  agree?: boolean;
  check_mark?: boolean;
}

export interface IBloodGroupQueryParams {
  search?: string;
  bloodGroup?: string;
  Blood_Group?: string;
  sscBatch?: string;
  SSC_Batch?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: string | number;
  limit?: string | number;
  startDate?: string;
  endDate?: string;
}
