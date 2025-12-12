import { AppError } from "../../util/error.js";
import ResponseFormatter from "../../util/response.js";
import { createInstallationSchema } from "../../util/validator.js";

export default class CameraHandler {
  constructor({ cameraService }) {
    this.cameraService = cameraService;
  }
  async installCamera(req, res) {
    const { id } = req.params;
    try {
      const result = await this.cameraService.getInstallationById(id);
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
  async createInstallation(req, res) {
    try {
      const data = createInstallationSchema.parse(req.body);
      const result = await this.cameraService.createInstallation(data);
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }
}
