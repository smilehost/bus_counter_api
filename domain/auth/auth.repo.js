import { getDBFromContext, uow } from '../../util/uow.js';

/**
 * Authentication repository with transaction support using UnitOfWork pattern
 */
export class AuthRepo {
    constructor() {}

    async getListCompany() {
        const db = getDBFromContext();
        return db.company.findMany({
            where: {
                deleted_at: null,
            },
        });
    }
}