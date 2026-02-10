import db from "../../prisma/client.js";

export default class DeviceRepo {
  constructor({ currentUser }) {
    this.currentUser = currentUser;
  }

  // superadmin (role 1) = query all, companyAdmin (role 2) = own com_id only
  _comIdFilter() {
    if (!this.currentUser) return {};
    if (this.currentUser.account_role === 1) return {};
    return { installed_com_id: this.currentUser.com_id };
  }

  async getInstalledDevices() {
    return await db.installed_device.findMany({
      where: {
        ...this._comIdFilter(),
        deleted_at: null,
      },
      include: {
        cameraGroups: true,
      },
    });
  }

  async getInstalledDeviceById(id) {
    return await db.installed_device.findFirst({
      where: {
        installed_id: parseInt(id),
        ...this._comIdFilter(),
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
        ...this._comIdFilter(),
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
      include: {
        cameraGroups: true,
      },
    });
  }

  async createInstalledDeviceWithCameras(deviceData, camerasGroupData) {
    return await db.$transaction(async (tx) => {
      // Create device
      const device = await tx.installed_device.create({
        data: deviceData,
      });

      // Create camera groups if provided
      if (camerasGroupData && camerasGroupData.length > 0) {
        await tx.camera_group.createMany({
          data: camerasGroupData.map((camera) => ({
            ...camera,
            camera_group_installed_device_id: device.installed_id,
          })),
        });
      }

      // Return device with camera groups
      return await tx.installed_device.findUnique({
        where: { installed_id: device.installed_id },
        include: { cameraGroups: true },
      });
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
