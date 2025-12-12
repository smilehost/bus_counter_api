import { AppError } from "../../util/error.js";
import db from "../../prisma/client.js";

export default class CounterRepo {
  constructor() {}
  async findCounter(id) {
    try {
      return await db.counter.findUnique({
        where: {
          counter_id: parseInt(id),
        },
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }
  async findAllCounters() {
    try {
      // Raw Query
      return await db.$queryRaw`SELECT * FROM counter`;
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }
}
