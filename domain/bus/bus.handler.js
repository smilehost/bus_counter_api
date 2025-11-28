import { AppError } from "../../util/error.js";
import ResponseFormatter from "../../util/response.js";

export default class BusHandler {
  constructor({ busService }) {
    this.busService = busService;
  }


  async getBus(req, res) {
    try{
      const { id } = req.params;
      const result = await this.busService.getBusInfo(parseInt(id));
      
      res.json(ResponseFormatter.success(result));

    } catch (err){
      AppError.handleError(res, err);
    }

  };
}
