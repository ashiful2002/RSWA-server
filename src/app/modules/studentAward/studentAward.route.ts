import { Router } from "express";
import { studentAwardController } from "./studentAward.controller";

const router = Router();

// Seed data endpoint
router.post("/seed", studentAwardController.seedStudentAwardData);

// Public form submission & GET list routes
router.post("/", studentAwardController.createStudentAwardSubmission);
router.get("/", studentAwardController.getAllStudentAwardSubmissions);
router.get("/:id", studentAwardController.getSingleStudentAwardSubmission);
router.delete("/:id", studentAwardController.deleteStudentAwardSubmission);

export const studentAwardRoutes = router;
