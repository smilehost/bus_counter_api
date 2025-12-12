import { AppError } from "../../util/error.js";
import ResponseFormatter from "../../util/response.js";
import { QueryRangeToUTC, DateToUTC } from "../../util/day.js";

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
    try {
      const result = await this.counterService.getAllCounters();
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }
  async getCountersByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const { startDateUTC, endDateUTC } = QueryRangeToUTC(startDate, endDate);
      const result = await this.counterService.getCountersByDateRange(
        startDateUTC,
        endDateUTC
      );
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }
  async getCountersByDate(req, res) {
    try {
      const { date } = req.query;
      const { QueryStart, QueryEnd } = DateToUTC(date);
      console.log("Converted date to UTC:", { QueryStart, QueryEnd });
      const result = await this.counterService.getCountersByDate(
        QueryStart,
        QueryEnd
      );
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }
}
