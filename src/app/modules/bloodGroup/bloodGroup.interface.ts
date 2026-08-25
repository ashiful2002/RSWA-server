export interface IBloodGroup {
  Name?: string;
  Blood_Group?: string;
  Phone?: string;
  District?: string;
  Upazila?: string;
}

export interface IBloodGroupQueryParams {
  search?: string;
  bloodGroup?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: string | number;
  limit?: string | number;
}
