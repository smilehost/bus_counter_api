import express from "express";
import { makeInvoker } from "awilix-express";
import BusHandler from "../domain/bus/bus.handler.js";
import AuthHandler from "../domain/auth/auth.handler.js";
import CounterHandler from "../domain/counter/counter.handler.js";

const setupRoutes = () => {
  const router = express.Router();

  // makeInvoker ต้องรับ class ไม่ใช่ string
  const busApi = makeInvoker(BusHandler);
  const authApi = makeInvoker(AuthHandler);
  const counterApi = makeInvoker(CounterHandler);

  router.get("/bus/:id", busApi("getBus"));

  return router;
};

export default setupRoutes;
