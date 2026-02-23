import { AppError } from "../../util/error.js";

export default class FaceService {
  constructor({ faceRepo }) {
    this.faceRepo = faceRepo;
  }

  async getFaceById(id) {
    const face = await this.faceRepo.findFace(id);
    if (!face) {
      throw new AppError("Face not found", 404);
    }
    return face;
  }

  async getAllFaces() {
    return await this.faceRepo.findAllFaces();
  }

  async getFacesByCounterId(counterId) {
    return await this.faceRepo.findFacesByCounterId(counterId);
  }

  async getFacesByGender(gender) {
    const validGenders = ["Male", "Female", "Unknown"];
    if (!validGenders.includes(gender)) {
      throw new AppError(
        "Invalid gender. Must be Male, Female, or Unknown",
        400,
      );
    }
    return await this.faceRepo.findFacesByGender(gender);
  }

  async getFacesByDateRange(startDate, endDate) {
    return await this.faceRepo.findFacesByDateRange(startDate, endDate);
  }

  async deleteFace(id) {
    const face = await this.faceRepo.findFace(id);
    if (!face) {
      throw new AppError("Face not found", 404);
    }
    return await this.faceRepo.deleteFace(id);
  }
}
