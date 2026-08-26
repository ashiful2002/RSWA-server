import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { connectDB } from "./app/db/db.config";

const app: Application = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://rswaa.vercel.app",
  "https://rrswa.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Ensure MongoDB database connection on serverless requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("RSWA server is running");
});

// Application routes (supports both /api/v1 and root prefixes)
app.use("/api/v1", router);

// Global Error Handlers
app.use(notFound);
app.use(globalErrorHandler);

export default app;
