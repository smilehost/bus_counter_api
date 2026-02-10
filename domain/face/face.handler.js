import { AppError } from "../../util/error.js";
import ResponseFormatter from "../../util/response.js";
import { QueryRangeToUTC } from "../../util/day.js";

export default class FaceHandler {
  constructor({ faceService }) {
    this.faceService = faceService;
  }

  async getFace(req, res) {
    const { id } = req.params;
    try {
      const result = await this.faceService.getFaceById(parseInt(id));
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }

  async getAllFaces(req, res) {
    try {
      const result = await this.faceService.getAllFaces();
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }

  async getFacesByCounter(req, res) {
    const { counterId } = req.params;
    try {
      const result = await this.faceService.getFacesByCounterId(counterId);
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }

  async getFacesByGender(req, res) {
    const { gender } = req.params;
    try {
      const result = await this.faceService.getFacesByGender(gender);
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }

  async getFacesByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const { startDateUTC, endDateUTC } = QueryRangeToUTC(startDate, endDate);
      const result = await this.faceService.getFacesByDateRange(
        startDateUTC,
        endDateUTC,
      );
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }

  async deleteFace(req, res) {
    const { id } = req.params;
    try {
      await this.faceService.deleteFace(parseInt(id));
      res.json(
        ResponseFormatter.success({ message: "Face deleted successfully" }),
      );
    } catch (err) {
      AppError.handleError(res, err);
    }
  }
}
