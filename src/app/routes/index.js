const express = require("express");
const userRoutes = require("../modules/users/user.route");
const bloodGroupRoutes = require("../modules/bloodGroup/bloodGroup.route");

const router = express.Router();

const moduleRoutes = [
  { path: "/users", route: userRoutes },
  { path: "/blood-group", route: bloodGroupRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
