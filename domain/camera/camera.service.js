import { AppError } from "../../util/error.js";
import db from "../../prisma/client.js";

export default class CameraService {
  constructor({ cameraRepo }) {
    this.cameraRepo = cameraRepo;
  }

  // ==================== Camera Group ====================
  async getCameraGroupById(id) {
    const cameraGroup = await this.cameraRepo.getCameraGroupById(id);
    if (!cameraGroup) {
      throw new AppError("Camera group not found", 404);
    }
    return cameraGroup;
  }

  async getAllCameraGroups() {
    return await this.cameraRepo.getCameraGroups();
  }

  async getCameraGroupsByDeviceId(deviceId) {
    const device = await db.installed_device.findUnique({
      where: { installed_id: parseInt(deviceId), deleted_at: null },
    });
    if (!device) {
      throw new AppError("Installed device not found", 404);
    }
    return await this.cameraRepo.getCameraGroupsByDeviceId(deviceId);
  }

  async createCameraGroup(data) {
    // Validate device exists
    const device = await db.installed_device.findUnique({
      where: {
        installed_id: data.camera_group_installed_device_id,
        deleted_at: null,
      },
    });
    if (!device) {
      throw new AppError("Installed device not found", 404);
    }
    return await this.cameraRepo.createCameraGroup(data);
  }

  async updateCameraGroup(id, data) {
    const cameraGroup = await this.cameraRepo.getCameraGroupById(id);
    if (!cameraGroup) {
      throw new AppError("Camera group not found", 404);
    }
    return await this.cameraRepo.updateCameraGroup(id, data);
  }
}
