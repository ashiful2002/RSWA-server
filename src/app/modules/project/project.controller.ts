import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { projectService } from "./project.service";

const createProject = catchAsync(async (req: Request, res: Response) => {
  const result = await projectService.createProjectInDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Project created successfully",
    data: result,
  });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  const result = await projectService.getAllProjectsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Projects retrieved successfully",
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
    data: result.data,
  });
});

const getSingleProject = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await projectService.getSingleProjectFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project details retrieved successfully",
    data: result,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await projectService.updateProjectInDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project updated successfully",
    data: result,
  });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await projectService.deleteProjectFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project deleted successfully",
    data: result,
  });
});

export const projectController = {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
};
