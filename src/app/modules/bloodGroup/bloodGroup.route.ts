import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../users/user.constant";
import { bloodGroupController } from "./bloodGroup.controller";
import { bloodGroupValidation } from "./bloodGroup.validation";

const router = Router();

// Public route to view donors
router.get("/", bloodGroupController.getBloodGroups);

// Public route to submit blood donor form
router.post(
  "/",
  validateRequest(bloodGroupValidation.createBloodGroupValidationSchema),
  bloodGroupController.createBloodGroup
);

// Update donor details (Admin & Moderator)
router.put(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.moderator),
  validateRequest(bloodGroupValidation.updateBloodGroupValidationSchema),
  bloodGroupController.updateBloodGroup
);

// Delete donor (Admin only)
router.delete(
  "/:id",
  auth(USER_ROLE.admin),
  bloodGroupController.deleteBloodGroup
);

export const bloodGroupRoutes = router;
