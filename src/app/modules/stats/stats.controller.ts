import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { statsService } from "./stats.service";

const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await statsService.getStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Stats retrieved successfully",
    data: result,
  });
});

export const statsController = {
  getStats,
};
