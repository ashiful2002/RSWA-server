import { NextFunction, Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { getAuth } from "../config/firebase.config";
import catchAsync from "../utils/catchAsync";
import User from "../modules/users/user.model";
import { TUserRole, IUser } from "../modules/users/user.interface";

export interface CustomRequest extends Request {
  user?: IUser;
  decoded?: DecodedIdToken;
}

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message:
            "Unauthorized access: Token missing or invalid header format",
        });
      }

      const token = authHeader.split(" ")[1];

      let decoded: DecodedIdToken;
      try {
        decoded = await getAuth().verifyIdToken(token);
      } catch (error: unknown) {
        const err = error as Error;
        console.error(" Firebase token verification failed:", err.message);
        return res.status(401).json({
          success: false,
          message: "Unauthorized access: Invalid or expired token",
        });
      }

      const email = decoded.email;
      if (!email) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access: Email missing in token",
        });
      }

      // Retrieve user from database to verify active status and role
      const user = await User.findOne({ email, isDeleted: { $ne: true } });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found or account disabled!",
        });
      }

      // Role-Based Authorization check
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden access: You do not have permission to access this route",
        });
      }

      req.decoded = decoded;
      req.user = user;
      next();
    }
  );
};

export default auth;
