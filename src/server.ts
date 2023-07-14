import mongoose from "mongoose";
import app from "./app";
import config from "./config";

import { Server } from "http";

process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception detected", error);
  process.exit(1);
});

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    console.log(`🛢 Database Connection Successfully`);

    app.listen(config.port, () => {
      console.log(`Server is listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(`Failed to connect database!`, error);
  }

  process.on("unhandledRejection", (error) => {
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

process.on("SIGTERM", () => {
  if (server) {
    server.close();
  }
});
