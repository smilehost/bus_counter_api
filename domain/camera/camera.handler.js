import { AppError } from "../../util/error.js";
import ResponseFormatter from "../../util/response.js";
import {
  createCameraGroupSchema,
  updateCameraGroupSchema,
} from "../../util/validator.js";

export default class CameraHandler {
  constructor({ cameraService }) {
    this.cameraService = cameraService;
  }

  // ==================== Camera Group ====================
  async getCameraGroup(req, res) {
    const { id } = req.params;
    try {
      const result = await this.cameraService.getCameraGroupById(id);
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }

  async listCameraGroups(req, res) {
    try {
      const result = await this.cameraService.getAllCameraGroups();
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }

  async getCameraGroupsByDevice(req, res) {
    const { deviceId } = req.params;
    try {
      const result = await this.cameraService.getCameraGroupsByDeviceId(
        deviceId
      );
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }

  async createCameraGroup(req, res) {
    try {
      const payload = req.body;
      const data = createCameraGroupSchema.parse(payload);
      const result = await this.cameraService.createCameraGroup(data);
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }

  async updateCameraGroup(req, res) {
    const { id } = req.params;
    try {
      const payload = req.body;
      const result = await this.cameraService.updateCameraGroup(id, payload);
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }
}
