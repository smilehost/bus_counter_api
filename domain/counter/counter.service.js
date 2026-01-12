import { AppError } from "../../util/error.js";

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

  async createFromPi(piData) {
    // Validate installed device exists
    const installedDevice = await this.counterRepo.findInstalledDeviceById(
      piData.installed_camera_id
    );

    if (!installedDevice) {
      throw new AppError("Installed device not found", 404);
    }

    // Map Pi data to counter schema
    const counterData = {
      counter_in_count: piData.in_count,
      counter_out_count: piData.out_count,
      counter_door_open_datetime: new Date(piData.door_open_datetime),
      counter_door_close_datetime: new Date(piData.door_close_datetime),
      counter_bus_id: piData.bus_id,
      counter_door_number: piData.door_num,
      counter_installed_device_id: piData.installed_camera_id,
      counter_com_id: installedDevice.installed_com_id,
      counter_lat: piData.lat,
      counter_lng: piData.lng,
      counter_busround_id: piData.bus_round_id || null,
    };

    return await this.counterRepo.createCounterWithFaces(
      counterData,
      piData.faces
    );
  }
}
