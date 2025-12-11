import express from "express";
import dotenv from "dotenv";
import { scopePerRequest } from "awilix-express";
import initContainer from "./di.js";
import setupRoutes from "./route.js";
import logger from "../util/logger.js";

dotenv.config();

async function start() {
  try {
    const app = express();
    app.use(express.json());

    const morganFormat =
      ":remote-addr :method :url :status :res[content-length] - :response-time ms";
    app.use(logger.httpLogger(morganFormat));

    const container = await initContainer();

    app.use(scopePerRequest(container));
    app.use("/api/v1", setupRoutes());

    app.get("/", (req, res) => {
      res.json({ message: "Hello API" });
    });

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
      console.log("Loaded modules:", Object.keys(container.registrations));
    });
  } catch (err) {
    console.error("Fatal startup error:", err);
  }
}

start();
