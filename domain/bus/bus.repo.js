import { getDBFromContext } from "../../util/uow.js";

export default class BusRepo {
  constructor() {}

  async findBus(id) {
    const db = getDBFromContext();
    return await db.bus.findUnique({
      where: {
        bus_id: parseInt(id),
      },
    });
  }
}
