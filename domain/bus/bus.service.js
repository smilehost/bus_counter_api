export default class BusService {
  constructor({ busRepo }) {
    this.busRepo = busRepo;
  }

  getBusInfo(id) {
    // Bussiness logic can be added here
    return this.busRepo.findBus(id);
  }
}
