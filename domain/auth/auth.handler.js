export default class AuthService {
  constructor({ authService }) {
    this.authService = authService;
  }

  handleGetUser(req, res) {
    const { id } = req.params;
    const result = this.authService.getUserInfo(id);
    res.json(result);
  }
}
