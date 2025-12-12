import { AppError } from "../../util/error.js";
import db from "../../prisma/client.js";

export default class CounterRepo {
  constructor({ currentUser }) {
    this.currentUser = currentUser;
  }
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
      return await db.$queryRaw`SELECT * FROM counter where counter_com_id = counter_id AND deleted_at IS NULL`;
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }
}
