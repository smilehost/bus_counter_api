export default class CameraService {
  constructor({ cameraRepo }) {
    this.cameraRepo = cameraRepo;
  }
  async getInstallationById(id) {
    // Bussiness logic can be added here
    return await this.cameraRepo.getInstallationById(id);
  }
  async getAllInstallationCameras() {
    // Bussiness logic can be added here
    return await this.cameraRepo.InstallationCameras();
  }
}
