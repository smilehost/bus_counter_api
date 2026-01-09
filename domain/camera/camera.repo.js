import db from "../../prisma/client.js";

export default class CameraRepo {
  constructor() {}

  // ==================== Camera Group ====================
  async getCameraGroups() {
    return await db.camera_group.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        installed_device: true,
      },
    });
  }

  async getCameraGroupById(id) {
    return await db.camera_group.findUnique({
      where: {
        camera_group_id: parseInt(id),
        deleted_at: null,
      },
      include: {
        installed_device: true,
      },
    });
  }

  async getCameraGroupsByDeviceId(deviceId) {
    return await db.camera_group.findMany({
      where: {
        camera_group_installed_device_id: parseInt(deviceId),
        deleted_at: null,
      },
    });
  }

  async createCameraGroup(data) {
    return await db.camera_group.create({
      data: data,
    });
  }

  async updateCameraGroup(id, data) {
    return await db.camera_group.update({
      where: {
        camera_group_id: parseInt(id),
      },
      data: data,
    });
  }
}
