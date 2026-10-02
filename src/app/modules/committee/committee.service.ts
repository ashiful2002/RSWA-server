import mongoose from "mongoose";
import CommitteeMember from "./committee.model";
import { ICommitteeMember, ICommitteeQueryParams } from "./committee.interface";

// Initial seed members to populate if the database is initially empty
const defaultMembers: ICommitteeMember[] = [
  {
    name: "Al Farazi Maruf",
    title: "President",
    image: "https://i.ibb.co.com/1YxjsrTL/maruf.jpg",
    session: "2026-2027",
    says: "Dedicated to the welfare, education, and collective progress of Rowmari students.",
    order: 1,
    isActive: true,
    social: {
      phone: "+880 18 2412 2969",
      whatsapp: "+8801824122969",
      facebook: "https://www.facebook.com/alfarazi01",
      email: "alfarazi.me@gmail.com",
    },
  },
  {
    name: "Mehedi Hasan Pollob",
    title: "General Secretary",
    image: "https://i.ibb.co.com/M5kT9WqL/pollob.jpg",
    session: "2026-2027",
    says: "Striving towards student empowerment, mutual support, and social development.",
    order: 2,
    isActive: true,
    social: {
      phone: "+880 1703-369290",
      whatsapp: "+8801703369290",
      facebook: "https://www.facebook.com/mehedihasanpollob11",
    },
  },
  {
    name: "Rokon Ahmed",
    title: "Senior Vice President",
    image: "https://i.ibb.co.com/9kpHrjhL/rokon.jpg",
    session: "2026-2027",
    says: "Committed to community service, blood donation drives, and academic excellence.",
    order: 3,
    isActive: true,
    social: {
      phone: "018 4955 4744",
      whatsapp: "01849554744",
      facebook: "https://www.facebook.com/rokonurjaman.rokon.10",
    },
  },
  {
    name: "Nahid Iqbal Likhon",
    title: "Joint General Secretary",
    image: "https://i.ibb.co.com/Fk4YQvZ8/nahid.jpg",
    session: "2026-2027",
    says: "Working together to build stronger student unity and provide critical welfare assistance.",
    order: 4,
    isActive: true,
    social: {
      phone: "+880 15 6828 0698",
      whatsapp: "+8801568280698",
      facebook: "https://www.facebook.com/nahidiqballikhon",
    },
  },
  {
    name: "Ashiful Islam Mukto",
    title: "Organizing Secretary",
    image: "https://i.ibb.co.com/Y71y12yq/ADB58506-F4-DC-4-D18-852-E-3828-ABE49-ABE.png",
    session: "2026-2027",
    says: "Connecting students across institutions and organizing developmental events.",
    order: 5,
    isActive: true,
    social: {
      phone: "01759-907907",
      whatsapp: "01759907907",
      facebook: "https://www.facebook.com/ashifulislam.mukto/",
      email: "ashifulislam2002@gmail.com",
    },
  },
];

const createCommitteeMemberInDB = async (payload: ICommitteeMember) => {
  const result = await CommitteeMember.create(payload);
  return result;
};

const getAllCommitteeMembersFromDB = async (
  queryParams: ICommitteeQueryParams
) => {
  const {
    search = "",
    session = "",
    isActive,
    sortField = "order",
    sortOrder = "asc",
  } = queryParams;

  // Check if DB is empty, if so, seed default members
  const count = await CommitteeMember.countDocuments();
  if (count === 0) {
    try {
      await CommitteeMember.insertMany(defaultMembers);
    } catch (e) {
      console.warn("Failed to auto-seed initial committee members:", e);
    }
  }

  const andConditions: Record<string, unknown>[] = [];

  if (search.trim()) {
    const searchRegex = { $regex: search.trim(), $options: "i" };
    andConditions.push({
      $or: [
        { name: searchRegex },
        { title: searchRegex },
        { session: searchRegex },
        { says: searchRegex },
      ],
    });
  }

  if (session.trim()) {
    andConditions.push({ session: session.trim() });
  }

  if (typeof isActive !== "undefined" && isActive !== "") {
    andConditions.push({ isActive: isActive === "true" });
  }

  const query = andConditions.length > 0 ? { $and: andConditions } : {};

  const sortDirection = sortOrder === "desc" ? -1 : 1;
  const sortOptions: Record<string, 1 | -1> = {
    [sortField]: sortDirection,
  };
  if (sortField !== "createdAt") {
    sortOptions["createdAt"] = 1;
  }

  const members = await CommitteeMember.find(query).sort(sortOptions);
  return members;
};

const getSingleCommitteeMemberFromDB = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid Committee Member ID") as Error & {
      statusCode?: number;
    };
    error.statusCode = 400;
    throw error;
  }

  const member = await CommitteeMember.findById(id);
  if (!member) {
    const error = new Error("Committee member not found") as Error & {
      statusCode?: number;
    };
    error.statusCode = 404;
    throw error;
  }

  return member;
};

const updateCommitteeMemberInDB = async (
  id: string,
  payload: Partial<ICommitteeMember>
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid Committee Member ID") as Error & {
      statusCode?: number;
    };
    error.statusCode = 400;
    throw error;
  }

  const result = await CommitteeMember.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );

  if (!result) {
    const error = new Error("Committee member not found") as Error & {
      statusCode?: number;
    };
    error.statusCode = 404;
    throw error;
  }

  return result;
};

const deleteCommitteeMemberInDB = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid Committee Member ID") as Error & {
      statusCode?: number;
    };
    error.statusCode = 400;
    throw error;
  }

  const result = await CommitteeMember.findByIdAndDelete(id);
  if (!result) {
    const error = new Error("Committee member not found") as Error & {
      statusCode?: number;
    };
    error.statusCode = 404;
    throw error;
  }

  return result;
};

export const committeeService = {
  createCommitteeMemberInDB,
  getAllCommitteeMembersFromDB,
  getSingleCommitteeMemberFromDB,
  updateCommitteeMemberInDB,
  deleteCommitteeMemberInDB,
};
