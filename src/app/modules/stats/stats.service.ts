import BloodGroup from "../bloodGroup/bloodGroup.model";
import User from "../users/user.model";
import { IStatsResponse } from "./stats.interface";

const getStats = async (): Promise<IStatsResponse> => {
  const [
    totalDonors,
    totalUsers,
    bloodGroupDistribution,
    sscBatchDistribution,
    topLocations,
    userRoleDistribution,
  ] = await Promise.all([
    // 1. Total blood donors
    BloodGroup.countDocuments(),

    // 2. Total registered users
    User.countDocuments(),

    // 3. Blood group distribution
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

    // 4. SSC Batch distribution
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

    // 5. Top present address locations
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

    // 6. User role distribution
    User.aggregate([
      {
        $match: {
          role: { $exists: true, $ne: "" },
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
  ]);

  return {
    totalDonors,
    totalUsers,
    bloodGroupDistribution,
    sscBatchDistribution,
    topLocations,
    userRoleDistribution,
  };
};

export const statsService = {
  getStats,
};
