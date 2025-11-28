

export class AuthHandler {
    
    constructor(authService) {
        this.authService = authService;
    }

    async getListCompanies(req, res) {
        const companies = await this.authService.getListCompanies();
        res.json(companies);
    }

}