export default class AuthService {
  constructor({ authRepo }) {
    this.authRepo = authRepo;
  }
  getUserInfo(id) {
    // Business logic can be added here
    return this.authRepo.findUser(id);
  }
}
