import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const getUserByEmail = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email as string;
  const result = await userService.getUserByEmailFromDB(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const getUserRole = catchAsync(async (req: Request, res: Response) => {
  const userEmail = req.params.email as string;
  const result = await userService.getUserRoleFromDB(userEmail);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User role retrieved successfully",
    data: result,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email as string;
  const { role } = req.body;
  const result = await userService.updateUserRoleInDB(email, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});

const markUserAsFraud = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email as string;
  const result = await userService.markUserAsFraudInDB(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Marked as fraud and properties removed",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email as string;
  const updateData = req.body;
  const result = await userService.updateUserInDB(email, updateData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;
  const result = await userService.saveUserToDB(userData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message || "User operation successful",
    data: result.result || result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email as string;
  const result = await userService.deleteUserFromDB(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const userController = {
  getAllUsers,
  getUserByEmail,
  getUserRole,
  updateUserRole,
  markUserAsFraud,
  updateUser,
  createUser,
  deleteUser,
};
