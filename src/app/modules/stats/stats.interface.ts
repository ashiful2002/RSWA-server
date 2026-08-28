export interface IDistributionItem {
  _id: string;
  count: number;
}

export interface IStatsResponse {
  totalDonors: number;
  totalUsers: number;
  totalProjects: number;
  totalStudentAwards: number;
  bloodGroupDistribution: IDistributionItem[];
  sscBatchDistribution: IDistributionItem[];
  topLocations: IDistributionItem[];
  userRoleDistribution: IDistributionItem[];
  projectCategoryDistribution: IDistributionItem[];
  studentAwardSessionDistribution: IDistributionItem[];
}
