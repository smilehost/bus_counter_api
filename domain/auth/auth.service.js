export default class AuthService {
  constructor({ authRepo }) {
    this.authRepo = authRepo;
  }
  async getUserInfo(id) {
    // Business logic can be added here
    return await this.authRepo.findUser(id);
  }
}
