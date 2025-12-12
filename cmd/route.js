import express from "express";
import { makeInvoker } from "awilix-express";
import BusHandler from "../domain/bus/bus.handler.js";
import AuthHandler from "../domain/auth/auth.handler.js";
import CounterHandler from "../domain/counter/counter.handler.js";
import CameraHandler from "../domain/camera/camera.handler.js";

const setupRoutes = () => {
  const router = express.Router();

  // makeInvoker ต้องรับ class ไม่ใช่ string
  const busApi = makeInvoker(BusHandler);
  const authApi = makeInvoker(AuthHandler);
  const counterApi = makeInvoker(CounterHandler);
  const cameraApi = makeInvoker(CameraHandler);

  router.get("/cameras/installations", cameraApi("listInstallations"));
  router.get("/camera/installation/:id", cameraApi("installCamera"));
  router.get("/counters/:id", counterApi("getCounter"));
  router.get("/counters", counterApi("getAllCounters"));

  return router;
};

export default setupRoutes;
