import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { committeeService } from "./committee.service";

const createCommitteeMember = catchAsync(
  async (req: Request, res: Response) => {
    const result = await committeeService.createCommitteeMemberInDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Committee member created successfully",
      data: result,
    });
  }
);

const getAllCommitteeMembers = catchAsync(
  async (req: Request, res: Response) => {
    const result = await committeeService.getAllCommitteeMembersFromDB(
      req.query
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Committee members retrieved successfully",
      data: result,
    });
  }
);

const getSingleCommitteeMember = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await committeeService.getSingleCommitteeMemberFromDB(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Committee member details retrieved successfully",
      data: result,
    });
  }
);

const updateCommitteeMember = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await committeeService.updateCommitteeMemberInDB(
      id,
      req.body
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Committee member updated successfully",
      data: result,
    });
  }
);

const deleteCommitteeMember = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await committeeService.deleteCommitteeMemberInDB(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Committee member deleted successfully",
      data: result,
    });
  }
);

export const committeeController = {
  createCommitteeMember,
  getAllCommitteeMembers,
  getSingleCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
};
