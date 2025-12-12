import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(payload, expiresIn = "1h") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
export function decodeToken(token) {
  return jwt.decode(token);
}
