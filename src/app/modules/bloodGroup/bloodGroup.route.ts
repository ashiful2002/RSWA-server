import { Router } from "express";
import { bloodGroupController } from "./bloodGroup.controller";

const router = Router();

router.get("/", bloodGroupController.getBloodGroups);
router.post("/", bloodGroupController.createBloodGroup);
router.put("/:id", bloodGroupController.updateBloodGroup);
router.delete("/:id", bloodGroupController.deleteBloodGroup);

export const bloodGroupRoutes = router;
