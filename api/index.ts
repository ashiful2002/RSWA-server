// Vercel serverless entry point.
// This file ONLY exports the Express app — it does NOT call app.listen().
// Vercel's @vercel/node runtime handles the HTTP server lifecycle.
import app from "../src/app";

export default app;

