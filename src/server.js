const app = require("./app");
const config = require("./app/config");
const { connectDB } = require("./app/db/db.config");

async function main() {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`RSWA  server is runnning in port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

main();
