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
      data.installed_device_uid,
    );
    if (existing) {
      throw new AppError("Device with this UID already exists", 409);
    }

    const deviceData = {
      installed_device_name: data.installed_device_name,
      installed_device_uid: data.installed_device_uid,
      installed_bus_id: data.installed_bus_id,
      installed_com_id: data.installed_com_id,
      installed_access_key: "ACCESS_" + Date.now(),
    };

    // Transform cameras_group to database format
    const camerasGroupData = data.cameras_group?.map((camera) => ({
      camera_group_door_number: camera.door_num,
      camera_group_camera_status: 1, // default active
      camera_group_camera_top_uid: camera.camera_top_uid,
      camera_group_camera_face_uid: camera.camera_face_uid,
    }));

    return await this.deviceRepo.createInstalledDeviceWithCameras(
      deviceData,
      camerasGroupData,
    );
  }

  async updateInstalledDevice(id, data) {
    const device = await this.deviceRepo.getInstalledDeviceById(id);
    if (!device) {
      throw new AppError("Installed device not found", 404);
    }

    // Transform data to database format
    const updateData = {};
    if (data.device_name) updateData.installed_device_name = data.device_name;
    if (data.device_uid) updateData.installed_device_uid = data.device_uid;
    if (data.bus_id) updateData.installed_bus_id = data.bus_id;
    if (data.com_id) updateData.installed_com_id = data.com_id;

    return await this.deviceRepo.updateInstalledDevice(id, updateData);
  }

  async deleteInstalledDevice(id) {
    const device = await this.deviceRepo.getInstalledDeviceById(id);
    if (!device) {
      throw new AppError("Installed device not found", 404);
    }
    return await this.deviceRepo.deleteInstalledDevice(id);
  }
}
