import { Router } from "express";
import { studentAwardController } from "./studentAward.controller";
import auth from "../../middlewares/auth";
 import { USER_ROLE } from "../users/user.constant";

const router = Router();



// Public form submission & GET list routes
router.post("/", studentAwardController.createStudentAwardSubmission);
router.get("/", auth(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.moderator), studentAwardController.getAllStudentAwardSubmissions);
router.get("/:id", auth(USER_ROLE.super_admin, USER_ROLE.admin, USER_ROLE.moderator), studentAwardController.getSingleStudentAwardSubmission);
router.delete("/:id", auth(USER_ROLE.super_admin, USER_ROLE.admin), studentAwardController.deleteStudentAwardSubmission);

export const studentAwardRoutes = router;
