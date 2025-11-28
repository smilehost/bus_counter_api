export default class AuthService {
  constructor({ authService }) {
    this.authService = authService;
  }

  async handleGetUser(req, res) {
    const { id } = req.params;
    
    const result = await this.authService.getUserInfo(id);
    res.json(result);
  }
}
