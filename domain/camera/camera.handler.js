import { AppError } from "../../util/error.js";
import ResponseFormatter from "../../util/response.js";

export default class CameraHandler {
  constructor({ cameraService }) {
    this.cameraService = cameraService;
  }
  async getCamera(req, res) {
    const { id } = req.params;
    try {
      const result = await this.cameraService.getCameraInfo(id);
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }
  async listCameras(req, res) {
    try {
      const result = await this.cameraService.getAllCameras();
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }
  async installCamera(req, res) {
    const { id } = req.params;
    try {
      const result = await this.cameraService.getInstallationByCameraId(id);
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }
  async listInstallations(req, res) {
    try {
      const result = await this.cameraService.getAllInstallationCameras();
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }
}
