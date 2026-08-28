import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../users/user.constant";
import { projectController } from "./project.controller";
import { projectValidation } from "./project.validation";

const router = Router();

// Public routes to view projects
router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getSingleProject);

// Protected routes to create, update, delete projects
router.post(
  "/",
  auth(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.moderator),
  validateRequest(projectValidation.createProjectValidationSchema),
  projectController.createProject
);

router.put(
  "/:id",
  auth(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.moderator),
  validateRequest(projectValidation.updateProjectValidationSchema),
  projectController.updateProject
);

router.delete(
  "/:id",
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  projectController.deleteProject
);

export const projectRoutes = router;
