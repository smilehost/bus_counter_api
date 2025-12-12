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
      const com_id = this.currentUser ? this.currentUser.com_id : null;
      return await db.$queryRaw`SELECT * FROM counter where counter_com_id = ${com_id} AND deleted_at IS NULL`;
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }
  async findByDateRange(startDate, endDate) {
    try {
      const com_id = this.currentUser ? this.currentUser.com_id : null;
      return await db.$queryRaw`
        SELECT * FROM counter 
        WHERE counter_com_id = ${com_id} 
          AND DATE(counter_created_at) >= ${startDate} 
          AND DATE(counter_created_at) <= ${endDate} 
          AND deleted_at IS NULL`;
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }
  async findByDate(startQuery, endQuery) {
    try {
      const com_id = this.currentUser ? this.currentUser.com_id : null;
      return await db.$queryRaw`
        SELECT * FROM counter 
        WHERE counter_com_id = ${com_id} 
          AND counter_created_at >= ${startQuery} 
          AND counter_created_at <= ${endQuery} 
          AND deleted_at IS NULL`;
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }
}
