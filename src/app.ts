import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4000",
  "http://localhost:5000",
  "https://rswa-web-app.web.app",
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

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("RSWA server is running");
});

// Application routes
app.use("/", router);

// Global Error Handlers
app.use(notFound);
app.use(globalErrorHandler);

export default app;
