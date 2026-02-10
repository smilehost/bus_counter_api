import { AppError } from "../../util/error.js";
import db from "../../prisma/client.js";

export default class FaceRepo {
  constructor({ currentUser }) {
    this.currentUser = currentUser;
  }

  // superadmin (role 1) = query all, companyAdmin (role 2) = own com_id only
  _comIdFilter() {
    if (!this.currentUser) return {};
    if (this.currentUser.account_role === 1) return {};
    return {
      counter: {
        counter_com_id: this.currentUser.com_id,
      },
    };
  }

  async findFace(id) {
    try {
      return await db.face.findFirst({
        where: {
          face_id: parseInt(id),
          ...this._comIdFilter(),
          deleted_at: null,
        },
        include: {
          counter: true,
        },
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }

  async findAllFaces() {
    try {
      return await db.face.findMany({
        where: {
          ...this._comIdFilter(),
          deleted_at: null,
        },
        include: {
          counter: true,
        },
        orderBy: {
          created_at: "desc",
        },
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }

  async findFacesByCounterId(counterId) {
    try {
      return await db.face.findMany({
        where: {
          counter_id: parseInt(counterId),
          ...this._comIdFilter(),
          deleted_at: null,
        },
        include: {
          counter: true,
        },
        orderBy: {
          timestamp: "asc",
        },
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }

  async findFacesByGender(gender) {
    try {
      return await db.face.findMany({
        where: {
          gender: gender,
          ...this._comIdFilter(),
          deleted_at: null,
        },
        include: {
          counter: true,
        },
        orderBy: {
          created_at: "desc",
        },
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }

  async findFacesByDateRange(startDate, endDate) {
    try {
      return await db.face.findMany({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
          ...this._comIdFilter(),
          deleted_at: null,
        },
        include: {
          counter: true,
        },
        orderBy: {
          timestamp: "asc",
        },
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }

  async deleteFace(id) {
    try {
      return await db.face.update({
        where: {
          face_id: parseInt(id),
        },
        data: {
          deleted_at: new Date(),
        },
      });
    } catch (err) {
      throw AppError.fromPrismaError(err);
    }
  }
}
