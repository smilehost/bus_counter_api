
export class AuthService {
    constructor(authRepo) {
        this.authRepo = authRepo;
    }

    async getListCompanies() {
        return this.authRepo.getListCompanies();
    }

}