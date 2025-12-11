export default class CounterService {
  constructor({ counterRepo }) {
    this.counterRepo = counterRepo;
  }
  async getCounterInfo(id) {
    // Bussiness logic can be added here
    return await this.counterRepo.findCounter(id);
  }
}
