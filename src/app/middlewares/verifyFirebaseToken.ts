import { Request, Response, NextFunction } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { getAuth } from "../config/firebase.config";

export interface CustomRequest extends Request {
  decoded?: DecodedIdToken;
}

const verifyFirebaseToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({
      message: "Unauthorized access",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await getAuth().verifyIdToken(token);
    req.decoded = decoded;
    next();
  } catch (error: unknown) {
    const err = error as Error;
    console.error("🔥 Firebase token verification failed:", err.message);
    return res.status(403).send({
      message: "Forbidden access",
    });
  }
};

export default verifyFirebaseToken;
