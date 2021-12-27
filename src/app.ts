import express from "express";
import { createConnection } from "typeorm";
import { setupRoutes } from "./routes";
import cors from "cors";

// create typeorm connection

createConnection().then((connection) => {
  // create and setup express app
  const app = express();
  app.use(express.json());
  app.use(cors());

  // register routes
  setupRoutes(app);

  // start express server
  app.listen(3001);
});
