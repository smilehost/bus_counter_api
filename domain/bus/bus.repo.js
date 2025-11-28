import db from "../../prisma/client.js";

export default class BusRepo {
  constructor() {}

  findBus(id) {
    return { id, name: "Bus " + id, capacity: 50 };
  }
}
