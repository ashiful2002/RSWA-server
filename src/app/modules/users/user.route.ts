import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { userController } from "./user.controller";

const router = Router();

// Get all users (Admin & Moderator only)
router.get("/", auth(USER_ROLE.admin), userController.getAllUsers);

// Get user by email
router.get("/:email", userController.getUserByEmail);

// Get user role (Any logged in user)
router.get(
  "/:email/role",
  auth(USER_ROLE.admin, USER_ROLE.moderator, USER_ROLE.donor),
  userController.getUserRole
);

// Update user role (Admin only)
router.put(
  "/:email/role",
  auth(USER_ROLE.admin),
  userController.updateUserRole
);

// Update user info (Authenticated User or Admin)
router.put(
  "/:email",
  auth(USER_ROLE.admin, USER_ROLE.moderator, USER_ROLE.donor),
  userController.updateUser
);

// Create / Login user (Any authenticated Firebase user)
router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.moderator, USER_ROLE.donor),
  userController.createUser
);

// Delete / Soft-delete user (Admin only)
router.delete("/:email", auth(USER_ROLE.admin), userController.deleteUser);

export const userRoutes = router;
