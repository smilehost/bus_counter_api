import { AppError } from "../../util/error.js";
import ResponseFormatter from "../../util/response.js";

export default class CounterHandler {
  constructor({ counterService }) {
    this.counterService = counterService;
  }
  async getCounter(req, res) {
    try {
      const { id } = req.params;
      const result = await this.counterService.getCounterInfo(parseInt(id));
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }
  async getAllCounters(req, res) {
    const { user } = req;
    try {
      const result = await this.counterService.getAllCounters();
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }
}
