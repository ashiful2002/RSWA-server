import { Router } from "express";
import { userRoutes } from "../modules/users/user.route";
import { bloodGroupRoutes } from "../modules/bloodGroup/bloodGroup.route";
import { statsRoutes } from "../modules/stats/stats.route";
import { projectRoutes } from "../modules/project/project.route";
import { studentAwardRoutes } from "../modules/studentAward/studentAward.route";

const router = Router();

interface IModuleRoute {
  path: string;
  route: Router;
}

const moduleRoutes: IModuleRoute[] = [
  { path: "/users", route: userRoutes },
  { path: "/blood-group", route: bloodGroupRoutes },
  { path: "/stats", route: statsRoutes },
  { path: "/projects", route: projectRoutes },
  { path: "/student-award", route: studentAwardRoutes },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
