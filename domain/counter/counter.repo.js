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
          deleted_at: null,
        },
        include: {
          installed_device: true,
          face: true,
        },
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }

  async findAllCounters() {
    try {
      const com_id = this.currentUser ? this.currentUser.com_id : null;
      return await db.counter.findMany({
        where: {
          counter_com_id: com_id,
          deleted_at: null,
        },
        include: {
          installed_device: true,
          face: true,
        },
        orderBy: {
          created_at: "desc",
        },
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }

  async findByDateRange(startDate, endDate) {
    try {
      const com_id = this.currentUser ? this.currentUser.com_id : null;
      return await db.counter.findMany({
        where: {
          counter_com_id: com_id,
          created_at: {
            gte: startDate,
            lte: endDate,
          },
          deleted_at: null,
        },
        include: {
          installed_device: true,
          face: true,
        },
        orderBy: {
          created_at: "desc",
        },
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }

  async findByDate(startQuery, endQuery) {
    try {
      const com_id = this.currentUser ? this.currentUser.com_id : null;
      return await db.counter.findMany({
        where: {
          counter_com_id: com_id,
          created_at: {
            gte: startQuery,
            lte: endQuery,
          },
          deleted_at: null,
        },
        include: {
          installed_device: true,
          face: true,
        },
        orderBy: {
          created_at: "desc",
        },
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }

  async createCounter(data) {
    try {
      return await db.counter.create({
        data: data,
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }

  async findByBusId(busId) {
    try {
      const com_id = this.currentUser ? this.currentUser.com_id : null;
      return await db.counter.findMany({
        where: {
          counter_bus_id: parseInt(busId),
          counter_com_id: com_id,
          deleted_at: null,
        },
        include: {
          installed_device: true,
          face: true,
        },
        orderBy: {
          created_at: "desc",
        },
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }

  async findByBusRoundId(busRoundId) {
    try {
      const com_id = this.currentUser ? this.currentUser.com_id : null;
      return await db.counter.findMany({
        where: {
          counter_busround_id: parseInt(busRoundId),
          counter_com_id: com_id,
          deleted_at: null,
        },
        include: {
          installed_device: true,
          face: true,
        },
        orderBy: {
          counter_door_open_datetime: "asc",
        },
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }
}
