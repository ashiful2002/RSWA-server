import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../../../serviceAccountKey.json";

initializeApp({
  credential: cert(serviceAccount as Parameters<typeof cert>[0]),
});

export { getAuth };
