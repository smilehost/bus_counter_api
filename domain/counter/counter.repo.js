import { AppError } from "../../util/error.js";
import db from "../../prisma/client.js";

export default class CounterRepo {
  constructor({ currentUser }) {
    this.currentUser = currentUser;
  }

  // superadmin (role 1) = query all, companyAdmin (role 2) = own com_id only
  _comIdFilter() {
    if (!this.currentUser) return {};
    if (this.currentUser.account_role === 1) return {};
    return { counter_com_id: this.currentUser.com_id };
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
      return await db.counter.findMany({
        where: {
          ...this._comIdFilter(),
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
      return await db.counter.findMany({
        where: {
          ...this._comIdFilter(),
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
      return await db.counter.findMany({
        where: {
          ...this._comIdFilter(),
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
      return await db.counter.findMany({
        where: {
          counter_bus_id: parseInt(busId),
          ...this._comIdFilter(),
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
      return await db.counter.findMany({
        where: {
          counter_busround_id: parseInt(busRoundId),
          ...this._comIdFilter(),
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

  async createCounterWithFaces(counterData, faces) {
    try {
      return await db.$transaction(async (tx) => {
        // Create counter record
        const counter = await tx.counter.create({
          data: counterData,
        });

        // Create face records if provided
        if (faces && faces.length > 0) {
          const genderMap = { M: "Male", F: "Female", U: "Unknown" };
          const faceData = faces.map((face) => ({
            counter_id: counter.counter_id,
            tracking_id: face.tracking_id,
            gender: genderMap[face.gender] || "Unknown",
            age: face.age,
            gender_confidence: face.gender_confidence,
            age_confidence: face.age_confidence,
            timestamp: new Date(face.timestamp),
          }));

          await tx.face.createMany({
            data: faceData,
          });
        }

        // Return counter with faces
        return await tx.counter.findUnique({
          where: { counter_id: counter.counter_id },
          include: {
            installed_device: true,
            face: true,
          },
        });
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }

  async findInstalledDeviceById(installedId) {
    try {
      return await db.installed_device.findUnique({
        where: {
          installed_id: parseInt(installedId),
          deleted_at: null,
        },
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }
}
