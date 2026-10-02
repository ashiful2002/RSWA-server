import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../users/user.constant";
import { committeeController } from "./committee.controller";
import { committeeValidation } from "./committee.validation";

const router = Router();

// Public routes: Landing page and public visitors can view committee members
router.get("/", committeeController.getAllCommitteeMembers);
router.get("/:id", committeeController.getSingleCommitteeMember);

// Protected routes: CRUD operations for SUPER ADMIN ONLY
router.post(
  "/",
  auth(USER_ROLE.super_admin),
  validateRequest(committeeValidation.createCommitteeValidationSchema),
  committeeController.createCommitteeMember
);

router.put(
  "/:id",
  auth(USER_ROLE.super_admin),
  validateRequest(committeeValidation.updateCommitteeValidationSchema),
  committeeController.updateCommitteeMember
);

router.delete(
  "/:id",
  auth(USER_ROLE.super_admin),
  committeeController.deleteCommitteeMember
);

export const committeeRoutes = router;
