export default class BusService {
  constructor({ busRepo }) {
    this.busRepo = busRepo;
  }

  async getBusInfo(id) {
    // Bussiness logic can be added here
    return await this.busRepo.findBus(id);
  }
}
