import db from "../../prisma/client.js";

export default class CameraRepo {
  constructor() {}
  //   ตัวอย่างฟังก์ชันในการดึงข้อมูลกล้องจากฐานข้อมูล
  async InstallationCameras() {
    return await db.installed_camera.findMany({
      where: {
        deleted_at: null,
      },
    });
  }
  async getInstallationById(id) {
    return await db.installed_camera.findUnique({
      where: {
        install_id: parseInt(id),
        deleted_at: null,
      },
    });
  }
}
