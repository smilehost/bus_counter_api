export default class CounterService {
  constructor({ counterRepo }) {
    this.counterRepo = counterRepo;
  }
  async getCounterInfo(id) {
    // Bussiness logic can be added here
    return await this.counterRepo.findCounter(id);
  }
  async getAllCounters() {
    return await this.counterRepo.findAllCounters();
  }
  async getCountersByDateRange(startDate, endDate) {
    return await this.counterRepo.findByDateRange(startDate, endDate);
  }
  async getCountersByDate(startQuery, endQuery) {
    return await this.counterRepo.findByDate(startQuery, endQuery);
  }
}
