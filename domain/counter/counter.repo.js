import { AppError } from "../../util/error.js";
import { getDBFromContext } from "../../util/uow.js";

export default class CounterRepo {
  constructor() {}
  async findCounter(id) {
    try {
      const db = getDBFromContext();
      return await db.counter.findUnique({
        where: {
          counter_id: parseInt(id),
        },
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }
}
