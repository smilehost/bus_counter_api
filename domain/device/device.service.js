import { AppError } from "../../util/error.js";

export default class DeviceService {
  constructor({ deviceRepo }) {
    this.deviceRepo = deviceRepo;
  }

  async getInstalledDeviceById(id) {
    const device = await this.deviceRepo.getInstalledDeviceById(id);
    if (!device) {
      throw new AppError("Installed device not found", 404);
    }
    return device;
  }

  async getInstalledDeviceByUid(uid) {
    const device = await this.deviceRepo.getInstalledDeviceByUid(uid);
    if (!device) {
      throw new AppError("Installed device not found", 404);
    }
    return device;
  }

  async getAllInstalledDevices() {
    return await this.deviceRepo.getInstalledDevices();
  }

  async getInstalledDevicesByBusId(busId) {
    return await this.deviceRepo.getInstalledDevicesByBusId(busId);
  }

  async getInstalledDevicesByComId(comId) {
    return await this.deviceRepo.getInstalledDevicesByComId(comId);
  }

  async createInstalledDevice(data) {
    // Check if device UID already exists
    const existing = await this.deviceRepo.getInstalledDeviceByUid(
      data.installed_device_uid
    );
    if (existing) {
      throw new AppError("Device with this UID already exists", 409);
    }
    return await this.deviceRepo.createInstalledDevice(data);
  }

  async updateInstalledDevice(id, data) {
    const device = await this.deviceRepo.getInstalledDeviceById(id);
    if (!device) {
      throw new AppError("Installed device not found", 404);
    }
    return await this.deviceRepo.updateInstalledDevice(id, data);
  }

  async deleteInstalledDevice(id) {
    const device = await this.deviceRepo.getInstalledDeviceById(id);
    if (!device) {
      throw new AppError("Installed device not found", 404);
    }
    return await this.deviceRepo.deleteInstalledDevice(id);
  }
}
