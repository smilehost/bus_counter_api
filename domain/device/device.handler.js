import { AppError } from "../../util/error.js";
import ResponseFormatter from "../../util/response.js";
import {
  createInstalledDeviceSchema,
  updateInstalledDeviceSchema,
} from "../../util/validator.js";

export default class DeviceHandler {
  constructor({ deviceService }) {
    this.deviceService = deviceService;
  }

  async getInstalledDevice(req, res) {
    const { id } = req.params;
    try {
      const result = await this.deviceService.getInstalledDeviceById(id);
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }

  async listInstalledDevices(req, res) {
    try {
      const result = await this.deviceService.getAllInstalledDevices();
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }

  async getInstalledDevicesByBus(req, res) {
    const { busId } = req.params;
    try {
      const result = await this.deviceService.getInstalledDevicesByBusId(busId);
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }

  async getInstalledDevicesByCompany(req, res) {
    const { comId } = req.params;
    try {
      const result = await this.deviceService.getInstalledDevicesByComId(comId);
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }

  async createInstalledDevice(req, res) {
    try {
      const payload = req.body;
      const data = createInstalledDeviceSchema.parse(payload);
      const result = await this.deviceService.createInstalledDevice(data);
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }

  async updateInstalledDevice(req, res) {
    const { id } = req.params;
    try {
      const payload = req.body;
      const data = updateInstalledDeviceSchema.parse(payload);
      const result = await this.deviceService.updateInstalledDevice(id, data);
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }

  async deleteInstalledDevice(req, res) {
    const { id } = req.params;
    try {
      await this.deviceService.deleteInstalledDevice(id);
      res.json(
        ResponseFormatter.success({ message: "Device deleted successfully" })
      );
    } catch (err) {
      AppError.handleError(res, err);
    }
  }
}
