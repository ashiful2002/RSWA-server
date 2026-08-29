export type ProjectCategory =
  "Education" | "Health" | "Environment" | "Relief" | "Cultural";

export type ProjectStatus = "Active" | "Upcoming" | "Completed";

export interface IImpactMetrics {
  beneficiaries?: string;
  volunteersCount?: number;
  location?: string;
}

export interface IProject {
  _id?: string;
  title: string;
  slug?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  thumbnail: string;
  summary: string;
  description?: string;
  impactMetrics?: IImpactMetrics;
  startDate?: string;
  endDate?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectQueryParams {
  search?: string;
  category?: string;
  status?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: string | number;
  limit?: string | number;
}
