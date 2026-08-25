import { Router } from "express";
import verifyFirebaseToken from "../../middlewares/verifyFirebaseToken";
import { userController } from "./user.controller";

const router = Router();

router.get("/", verifyFirebaseToken as any, userController.getAllUsers);
router.get("/:email", userController.getUserByEmail);
router.get("/:email/role", verifyFirebaseToken as any, userController.getUserRole);
router.put("/:email/role", verifyFirebaseToken as any, userController.updateUserRole);
router.put("/:email/fraud", verifyFirebaseToken as any, userController.markUserAsFraud);
router.put("/:email", verifyFirebaseToken as any, userController.updateUser);
router.post("/", verifyFirebaseToken as any, userController.createUser);
router.delete("/:email", verifyFirebaseToken as any, userController.deleteUser);

export const userRoutes = router;
