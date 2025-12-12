import express from "express";
import { makeInvoker } from "awilix-express";
import AuthMiddleware from "../middleware/auth.middleware.js";
import BusHandler from "../domain/bus/bus.handler.js";
import AuthHandler from "../domain/auth/auth.handler.js";
import CounterHandler from "../domain/counter/counter.handler.js";
import CameraHandler from "../domain/camera/camera.handler.js";

const setupRoutes = () => {
  const router = express.Router();

  const authMiddleware = new AuthMiddleware();

  // makeInvoker ต้องรับ class ไม่ใช่ string
  const busApi = makeInvoker(BusHandler);
  const authApi = makeInvoker(AuthHandler);
  const counterApi = makeInvoker(CounterHandler);
  const cameraApi = makeInvoker(CameraHandler);

  // Public Routes (No Auth)
  const publicRouter = express.Router();
  publicRouter.post("/auth/login", authApi("Login"));

  // User Routes (Authenticated)
  const userRouter = express.Router();
  userRouter.use(authMiddleware.authenticate.bind(authMiddleware));

  userRouter.get("/cameras/installations", cameraApi("listInstallations"));
  userRouter.get("/camera/installation/:id", cameraApi("installCamera"));
  userRouter.post("/camera/installation", cameraApi("createInstallation"));
  userRouter.get("/counter/:id", counterApi("getCounter"));

  // Admin Routes (Admin Only)
  const adminRouter = express.Router();
  adminRouter.use(authMiddleware.authenticate.bind(authMiddleware));
  adminRouter.use(authMiddleware.canAccessRole(["admin"]));

  adminRouter.get("/counters", counterApi("getAllCounters"));
  adminRouter.get(
    "/counters/by-date-range",
    counterApi("getCountersByDateRange")
  );
  adminRouter.get("/counters/by-date", counterApi("getCountersByDate"));

  router.use(publicRouter);
  router.use(userRouter);
  router.use(adminRouter);

  return router;
};

export default setupRoutes;
