import { Router } from "express";
import { userRoutes } from "../modules/users/user.route";
import { bloodGroupRoutes } from "../modules/bloodGroup/bloodGroup.route";

const router = Router();

const moduleRoutes = [
  { path: "/users", route: userRoutes },
  { path: "/blood-group", route: bloodGroupRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
