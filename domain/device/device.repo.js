import db from "../../prisma/client.js";

export default class DeviceRepo {
  constructor() {}

  async getInstalledDevices() {
    return await db.installed_device.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        cameraGroups: true,
      },
    });
  }

  async getInstalledDeviceById(id) {
    return await db.installed_device.findUnique({
      where: {
        installed_id: parseInt(id),
        deleted_at: null,
      },
      include: {
        cameraGroups: true,
      },
    });
  }

  async getInstalledDeviceByUid(uid) {
    return await db.installed_device.findFirst({
      where: {
        installed_device_uid: uid,
        deleted_at: null,
      },
      include: {
        cameraGroups: true,
      },
    });
  }

  async getInstalledDevicesByBusId(busId) {
    return await db.installed_device.findMany({
      where: {
        installed_bus_id: parseInt(busId),
        deleted_at: null,
      },
      include: {
        cameraGroups: true,
      },
    });
  }

  async getInstalledDevicesByComId(comId) {
    return await db.installed_device.findMany({
      where: {
        installed_com_id: parseInt(comId),
        deleted_at: null,
      },
      include: {
        cameraGroups: true,
      },
    });
  }

  async createInstalledDevice(data) {
    return await db.installed_device.create({
      data: data,
    });
  }

  async updateInstalledDevice(id, data) {
    return await db.installed_device.update({
      where: {
        installed_id: parseInt(id),
      },
      data: data,
    });
  }

  async deleteInstalledDevice(id) {
    return await db.installed_device.update({
      where: {
        installed_id: parseInt(id),
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
