export default class BusHandler {
  constructor({ busService }) {
    this.busService = busService;
  }

  // ใช้ Arrow Function (= async (req, res) => {})
  // เพื่อให้เข้าถึง 'this.busService'
  getBus = async (req, res) => {
    const { id } = req.params;
    const result = this.busService.getBusInfo(id);
    res.json(result);
  };
}
