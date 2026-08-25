import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bloodGroupService } from "./bloodGroup.service";

const getBloodGroups = catchAsync(async (req: Request, res: Response) => {
  const result = await bloodGroupService.getBloodGroupsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blood groups retrieved successfully",
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
    data: result.data,
  });
});

const updateBloodGroup = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await bloodGroupService.updateBloodGroupInDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Donor updated successfully",
    data: result,
  });
});

const deleteBloodGroup = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await bloodGroupService.deleteBloodGroupFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Donor deleted successfully",
    data: result,
  });
});

const createBloodGroup = catchAsync(async (req: Request, res: Response) => {
  const result = await bloodGroupService.createBloodGroupInDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Data saved successfully",
    data: result,
  });
});

export const bloodGroupController = {
  getBloodGroups,
  updateBloodGroup,
  deleteBloodGroup,
  createBloodGroup,
};
