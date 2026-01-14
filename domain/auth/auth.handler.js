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
    const { code, service, session_id } = req.body;
    console.log("Login request received with:", { code, service, session_id });
    try {
      const response = await fetch(
        `https://authen-center.lab.bussing.app/api/v1/login/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, service, session_id }),
        }
      );

      const data = await response.json();

      if (data.success) {
        const {
          account_id,
          account_username,
          com_id,
          account_role,
          account_name,
          session_id: authSessionId,
        } = data.data;

        // Create access token (expires in 1 day)
        const access_token = generateToken(
          { account_id, account_username, com_id, account_role },
          "1d"
        );

        // Create refresh token (expires in 7 days)
        const refresh_token = generateToken(
          { account_id, session_id: authSessionId },
          "7d"
        );

        res.json(
          ResponseFormatter.success({
            access_token,
            refresh_token,
            account_name,
            com_id,
          })
        );
      } else {
        res.status(401).json(ResponseFormatter.error("Authentication failed"));
      }
    } catch (err) {
      throw AppError.from(err);
    }
  }
}
