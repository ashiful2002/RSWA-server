import BloodGroup from "../bloodGroup/bloodGroup.model";
import User from "../users/user.model";
import Project from "../project/project.model";
import StudentAward from "../studentAward/studentAward.model";
import { IStatsResponse } from "./stats.interface";

const getStats = async (): Promise<IStatsResponse> => {
  const [
    totalDonors,
    totalUsers,
    totalProjects,
    totalStudentAwards,
    bloodGroupDistribution,
    sscBatchDistribution,
    topLocations,
    userRoleDistribution,
    projectCategoryDistribution,
    studentAwardSessionDistribution,
  ] = await Promise.all([
    // 1. Total blood donors
    BloodGroup.countDocuments(),

    // 2. Total registered users
    User.countDocuments({ isDeleted: { $ne: true } }),

    // 3. Total projects
    Project.countDocuments(),

    // 4. Total student award submissions
    StudentAward.countDocuments(),

    // 5. Blood group distribution
    BloodGroup.aggregate([
      {
        $match: {
          Blood_Group: { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$Blood_Group",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]),

    // 6. SSC Batch distribution
    BloodGroup.aggregate([
      {
        $match: {
          SSC_Batch: { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$SSC_Batch",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    // 7. Top present address locations
    BloodGroup.aggregate([
      {
        $match: {
          Present_Address: { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$Present_Address",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),

    // 8. User role distribution
    User.aggregate([
      {
        $match: {
          role: { $exists: true, $ne: "" },
          isDeleted: { $ne: true },
        },
      },
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]),

    // 9. Project category distribution
    Project.aggregate([
      {
        $match: {
          category: { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]),

    // 10. Student Award session distribution
    StudentAward.aggregate([
      {
        $match: {
          session: { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$session",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return {
    totalDonors,
    totalUsers,
    totalProjects,
    totalStudentAwards,
    bloodGroupDistribution,
    sscBatchDistribution,
    topLocations,
    userRoleDistribution,
    projectCategoryDistribution,
    studentAwardSessionDistribution,
  };
};

export const statsService = {
  getStats,
};
