import db from "../../prisma/client.js";

export default class CameraRepo {
  constructor({ currentUser }) {
    this.currentUser = currentUser;
  }

  // superadmin (role 1) = query all, companyAdmin (role 2) = own com_id only
  _comIdFilter() {
    if (!this.currentUser) return {};
    if (this.currentUser.account_role === 1) return {};
    return {
      installed_device: {
        installed_com_id: this.currentUser.com_id,
      },
    };
  }

  // ==================== Camera Group ====================
  async getCameraGroups() {
    return await db.camera_group.findMany({
      where: {
        ...this._comIdFilter(),
        deleted_at: null,
      },
      include: {
        installed_device: true,
      },
    });
  }

  async getCameraGroupById(id) {
    return await db.camera_group.findFirst({
      where: {
        camera_group_id: parseInt(id),
        ...this._comIdFilter(),
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
        ...this._comIdFilter(),
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
