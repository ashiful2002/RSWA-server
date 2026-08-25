const express = require("express");
const verifyFirebaseToken = require("../../middlewares/verifyFirebaseToken");
const userController = require("./user.controller");

const router = express.Router();

router.get("/", verifyFirebaseToken, userController.getAllUsers);
router.get("/:email", userController.getUserByEmail);
router.get("/:email/role", verifyFirebaseToken, userController.getUserRole);
router.put("/:email/role", verifyFirebaseToken, userController.updateUserRole);
router.put("/:email/fraud", verifyFirebaseToken, userController.markUserAsFraud);
router.put("/:email", verifyFirebaseToken, userController.updateUser);
router.post("/", verifyFirebaseToken, userController.createUser);
router.delete("/:email", verifyFirebaseToken, userController.deleteUser);

module.exports = router;
