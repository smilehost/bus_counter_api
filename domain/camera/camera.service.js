import { AppError } from "../../util/error.js";

export default class CameraService {
  constructor({ cameraRepo }) {
    this.cameraRepo = cameraRepo;
  }

  async getInstallationById(id) {
    const installation = await this.cameraRepo.getInstallationById(id);

    // Business validation - ตรวจสอบว่ามีข้อมูลอยู่ไหม
    if (!installation) {
      throw new AppError("Installation not found", 404);
    }

    return installation;
  }

  async getAllInstallationCameras() {
    // Bussiness logic can be added here
    return await this.cameraRepo.InstallationCameras();
  }

  async createInstallation(data) {
    // // Business validation - ตรวจสอบว่า camera ซ้ำกับ bus/door ไหม
    // const existing = await this.cameraRepo.findByBusAndDoor(
    //   data.installed_bus_id,
    //   data.installed_door_bus_Id
    // );

    // if (existing) {
    //   throw new AppError("Camera already installed on this door", 409);
    // }

    // // Business validation - ตรวจสอบว่า bus มีอยู่จริงไหม
    // // (ถ้าต้องการ)

    return await this.cameraRepo.createInstallation(data);
  }
}
