import { Request, Response } from "express";
import { studentAwardService } from "./studentAward.service";

const createStudentAwardSubmission = async (req: Request, res: Response) => {
  try {
    const result = await studentAwardService.createStudentAwardSubmissionInDB(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Student award submission recorded successfully",
      data: result,
    });
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to record student award submission",
      error: err,
    });
  }
};

const getAllStudentAwardSubmissions = async (req: Request, res: Response) => {
  try {
    const result = await studentAwardService.getAllStudentAwardSubmissionsFromDB(
      req.query
    );

    res.status(200).json({
      success: true,
      message: "Student award submissions retrieved successfully",
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
      data: result.data,
    });
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to retrieve student award submissions",
      error: err,
    });
  }
};

const getSingleStudentAwardSubmission = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const result =
      await studentAwardService.getSingleStudentAwardSubmissionFromDB(id as string);

    res.status(200).json({
      success: true,
      message: "Student award submission retrieved successfully",
      data: result,
    });
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    res.status(err.statusCode || 404).json({
      success: false,
      message: err.message || "Submission not found",
      error: err,
    });
  }
};

const deleteStudentAwardSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result =
      await studentAwardService.deleteStudentAwardSubmissionFromDB(id as string);

    res.status(200).json({
      success: true,
      message: "Student award submission deleted successfully",
      data: result,
    });
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    res.status(err.statusCode || 404).json({
      success: false,
      message: err.message || "Failed to delete submission",
      error: err,
    });
  }
};

const seedStudentAwardData = async (_req: Request, res: Response) => {
  try {
    const result = await studentAwardService.seedStudentAwardDataInDB();

    res.status(200).json({
      success: true,
      message: result.message,
      count: result.count,
      data: result.data || [],
    });
  } catch (error) {
    const err = error as Error & { statusCode?: number };
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to seed student award data",
      error: err,
    });
  }
};

export const studentAwardController = {
  createStudentAwardSubmission,
  getAllStudentAwardSubmissions,
  getSingleStudentAwardSubmission,
  deleteStudentAwardSubmission,
  seedStudentAwardData,
};
