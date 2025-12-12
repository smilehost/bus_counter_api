import { verifyToken } from "../util/jwt.js";
import { AppError } from "../util/error.js";
import { asValue } from "awilix";

class AuthMiddleware {
  constructor() {}
  authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return AppError.handleError(
        res,
        AppError.Unauthorized("Authorization header missing or malformed.")
      );
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      if (req.container) {
        req.container.register({
          currentUser: asValue(decoded),
        });
      }
      next();
    } catch (err) {
      return AppError.handleError(
        res,
        AppError.Unauthorized("Invalid or expired token.")
      );
    }
  }
  canAccessRole(allowedRoles) {
    return (req, res, next) => {
      const userRole = req.user?.role;
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      if (!roles.includes(userRole)) {
        return AppError.handleError(
          res,
          AppError.Forbidden(
            "You do not have permission to access this resource."
          )
        );
      }
      next();
    };
  }
}

export default AuthMiddleware;
