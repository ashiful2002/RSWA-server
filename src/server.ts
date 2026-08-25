import app from "./app";
import config from "./app/config";
import { connectDB } from "./app/db/db.config";

async function main() {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`RSWA server is running in port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

main();
