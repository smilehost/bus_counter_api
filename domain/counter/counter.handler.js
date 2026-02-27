import { AppError } from "../../util/error.js";
import ResponseFormatter from "../../util/response.js";
import { QueryRangeToUTC, DateToUTC } from "../../util/day.js";
import { piCounterDataSchema } from "../../util/validator.js";

export default class CounterHandler {
  constructor({ counterService }) {
    this.counterService = counterService;
  }

  async receiveFromPi(req, res) {
    try {
      const validated = piCounterDataSchema.parse(req.body);
      const result = await this.counterService.createFromPi(validated);
      res
        .status(201)
        .json(
          ResponseFormatter.success(
            result,
            "Counter data received successfully",
          ),
        );
    } catch (err) {
      // console.error("Error in receiveFromPi:", err);
      AppError.handleError(res, err);
    }
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
      // console.log(result);
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      console.log(err);
      AppError.handleError(res, err);
    }
  }
  async getCountersByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const { startDateUTC, endDateUTC } = QueryRangeToUTC(startDate, endDate);
      const result = await this.counterService.getCountersByDateRange(
        startDateUTC,
        endDateUTC,
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
      const result = await this.counterService.getCountersByDate(
        QueryStart,
        QueryEnd,
      );
      res.json(ResponseFormatter.success(result));
    } catch (err) {
      AppError.handleError(res, err);
    }
  }
}
