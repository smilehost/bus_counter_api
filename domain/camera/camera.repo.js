import db from "../../prisma/client.js";

export default class CameraRepo {
  constructor() {}
  //   ตัวอย่างฟังก์ชันในการดึงข้อมูลกล้องจากฐานข้อมูล
  async findCamera(id) {
    return await db.camera_device.findUnique({
      where: {
        camera_id: parseInt(id),
        deleted_at: null,
      },
    });
  }
  async findCameras() {
    return await db.camera_device.findMany({
      where: {
        deleted_at: null,
      },
    });
  }
  async findInstallationByCameraId(camera_id) {
    return await db.installed_camera.findFirst({
      where: {
        installed_camera_id: parseInt(camera_id),
        deleted_at: null,
      },
    });
  }
  async InstallationCameras() {
    return await db.installed_camera.findMany({
      where: {
        deleted_at: null,
      },
    });
  }
}
