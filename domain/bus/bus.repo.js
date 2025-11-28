import { AppError } from "../../util/error.js";
import { getDBFromContext } from "../../util/uow.js";

export default class BusRepo {
  constructor() {}

  async findBus(id) {
    try{
      const db = getDBFromContext()
      return await db.bus.findUnique({
        where: {
          bus_id: parseInt(id),
        },
      })
    } catch (err){
      throw AppError.fromPrismaError(err);
    }
  }
}