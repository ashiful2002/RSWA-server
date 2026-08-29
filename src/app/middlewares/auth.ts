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

export interface AuthOptions {
  roles?: TUserRole[];
  allowNewUser?: boolean;
}

const auth = (...args: (TUserRole | AuthOptions)[]) => {
  let requiredRoles: TUserRole[] = [];
  let allowNewUser = false;

  if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
    const opts = args[0] as AuthOptions;
    requiredRoles = opts.roles || [];
    allowNewUser = !!opts.allowNewUser;
  } else {
    requiredRoles = args.filter(
      (arg): arg is TUserRole => typeof arg === "string"
    );
  }

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

      req.decoded = decoded;

      // Retrieve user from database to verify active status and role
      const user = await User.findOne({
        email: email.toLowerCase().trim(),
        isDeleted: { $ne: true },
      });

      if (!user) {
        if (allowNewUser) {
          req.user = undefined;
          return next();
        }

        return res.status(404).json({
          success: false,
          message: "User not found or account disabled!",
        });
      }

      if (user.status === "fraud") {
        return res.status(403).json({
          success: false,
          message: "Forbidden access: Account has been restricted",
        });
      }

      // Role-Based Authorization check: super_admin has full access across all protected routes
      console.log(`[AUTH DEBUG] User Email: ${user.email}, Role: ${user.role}`);
      console.log(`[AUTH DEBUG] Required Roles: ${requiredRoles.join(", ")}`);

      if (
        requiredRoles.length > 0 &&
        user.role !== "super_admin" &&
        !requiredRoles.includes(user.role)
      ) {
        console.log(
          `[AUTH DEBUG] FORBIDDEN! User role ${user.role} not in required roles.`
        );
        return res.status(403).json({
          success: false,
          message:
            "Forbidden access: You do not have permission to access this route",
        });
      }

      req.user = user;
      next();
    }
  );
};

export default auth;
