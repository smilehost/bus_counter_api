import express from "express";
import { makeInvoker } from "awilix-express";
import AuthMiddleware from "../middleware/auth.middleware.js";
import AuthHandler from "../domain/auth/auth.handler.js";
import CounterHandler from "../domain/counter/counter.handler.js";
import CameraHandler from "../domain/camera/camera.handler.js";
import DeviceHandler from "../domain/device/device.handler.js";
import FaceHandler from "../domain/face/face.handler.js";

const setupRoutes = () => {
  const router = express.Router();

  const authMiddleware = new AuthMiddleware();

  // makeInvoker ต้องรับ class ไม่ใช่ string
  const authApi = makeInvoker(AuthHandler);
  const counterApi = makeInvoker(CounterHandler);
  const cameraApi = makeInvoker(CameraHandler);
  const deviceApi = makeInvoker(DeviceHandler);
  const faceApi = makeInvoker(FaceHandler);

  // Public Routes (No Auth)
  const publicRouter = express.Router();
  publicRouter.post("/auth/login", authApi("Login"));
  publicRouter.post("/pi/config", deviceApi("piGetConfig"));
  publicRouter.post("/pi/counter", counterApi("receiveFromPi"));

  // User Routes (Authenticated)
  const userRouter = express.Router();
  userRouter.use(authMiddleware.authenticate.bind(authMiddleware));

  // Device routes
  userRouter.get("/devices", deviceApi("listInstalledDevices"));
  userRouter.get("/device/:id", deviceApi("getInstalledDevice"));
  userRouter.get("/devices/bus/:busId", deviceApi("getInstalledDevicesByBus"));
  userRouter.post("/device", deviceApi("createInstalledDevice"));
  userRouter.put("/device/:id", deviceApi("updateInstalledDevice"));
  userRouter.delete("/device/:id", deviceApi("deleteInstalledDevice"));

  // Camera group routes
  userRouter.get("/camera-groups", cameraApi("listCameraGroups"));
  userRouter.get("/camera-group/:id", cameraApi("getCameraGroup"));
  userRouter.get(
    "/camera-groups/device/:deviceId",
    cameraApi("getCameraGroupsByDevice"),
  );
  userRouter.post("/camera-group", cameraApi("createCameraGroup"));
  userRouter.put("/camera-group/:id", cameraApi("updateCameraGroup"));

  userRouter.get("/counter/:id", counterApi("getCounter"));

  // Face routes
  userRouter.get("/face/:id", faceApi("getFace"));
  userRouter.get("/faces/counter/:counterId", faceApi("getFacesByCounter"));
  userRouter.get("/faces/gender/:gender", faceApi("getFacesByGender"));
  userRouter.delete("/face/:id", faceApi("deleteFace"));

  // Admin Routes (Admin Only)
  const adminRouter = express.Router();
  adminRouter.use(authMiddleware.authenticate.bind(authMiddleware));
  adminRouter.use(authMiddleware.canAccessRole([1, 2]));

  adminRouter.get("/counters", counterApi("getAllCounters"));
  adminRouter.get(
    "/counters/by-date-range",
    counterApi("getCountersByDateRange"),
  );
  adminRouter.get("/counters/by-date", counterApi("getCountersByDate"));

  adminRouter.get("/faces", faceApi("getAllFaces"));
  adminRouter.get("/faces/by-date-range", faceApi("getFacesByDateRange"));

  router.use(publicRouter);
  router.use(userRouter);
  router.use(adminRouter);

  return router;
};

export default setupRoutes;
