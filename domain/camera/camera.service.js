export default class CameraService {
  constructor({ cameraRepo }) {
    this.cameraRepo = cameraRepo;
  }
  async getCameraInfo(id) {
    // Bussiness logic can be added here
    return await this.cameraRepo.findCamera(id);
  }
  async getAllCameras() {
    // Bussiness logic can be added here
    return await this.cameraRepo.findCameras();
  }
  async getInstallationByCameraId(camera_id) {
    // Bussiness logic can be added here
    return await this.cameraRepo.findInstallationByCameraId(camera_id);
  }
  async getAllInstallationCameras() {
    // Bussiness logic can be added here
    return await this.cameraRepo.InstallationCameras();
  }
}
