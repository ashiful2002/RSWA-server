import { Request, Response, NextFunction } from "express";
import { getAuth } from "../config/firebase.config";

export interface CustomRequest extends Request {
  decoded?: any;
}

const verifyFirebaseToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
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
  } catch (error: any) {
    console.error("🔥 Firebase token verification failed:", error.message);
    return res.status(403).send({
      message: "Forbidden access",
    });
  }
};

export default verifyFirebaseToken;
