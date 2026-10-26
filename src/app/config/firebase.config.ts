import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";

// Initialize Firebase Admin SDK
if (!getApps().length) {
  const serviceAccountPath = path.join(process.cwd(), "serviceAccountKey.json");

  if (fs.existsSync(serviceAccountPath)) {
    // 1. Local environment: load from serviceAccountKey.json
    try {
      const serviceAccount = JSON.parse(
        fs.readFileSync(serviceAccountPath, "utf-8")
      );
      initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (err) {
      console.error("Failed to load serviceAccountKey.json:", err);
    }
  } else if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    // 2. Production / Vercel environment: load from environment variables
    try {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Handle both escaped \n and raw newlines
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
    } catch (err) {
      console.error("Failed to initialize Firebase Admin from env vars:", err);
    }
  } else {
    console.warn(
      "Firebase Admin SDK not initialized: missing serviceAccountKey.json or FIREBASE_* environment variables."
    );
  }
}

export { getAuth };
