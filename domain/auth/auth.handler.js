import { generateToken } from "../../util/jwt.js";
import { AppError } from "../../util/error.js";
import ResponseFormatter from "../../util/response.js";

export default class AuthHandler {
  constructor({ authService }) {
    this.authService = authService;
  }

  async handleGetUser(req, res) {
    const { id } = req.params;

    const result = await this.authService.getUserInfo(id);
    res.json(result);
  }

  async Login(req, res) {
    // mock user authentication
    const payload = {
      user: "artijom",
      com_id: 1,
      role: "admin",
    };
    try {
      const token = generateToken(payload, "1d");
      res.json(ResponseFormatter.success({ token }));
    } catch (err) {
      return AppError.handleError(
        res,
        AppError.InternalServerError("Failed to generate token.")
      );
    }
  }
}
