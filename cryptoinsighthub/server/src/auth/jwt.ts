import jwt from "jsonwebtoken";
import { config } from "../config.js";

export interface SessionPayload {
  sub: number;
  email: string;
  username: string;
}

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    algorithm: "HS256",
    expiresIn: config.jwtTtlSeconds,
    issuer: "cryptoinsighthub",
    audience: "cryptoinsighthub-web",
  });
}

export function verifySession(token: string): SessionPayload {
  const decoded = jwt.verify(token, config.jwtSecret, {
    algorithms: ["HS256"],
    issuer: "cryptoinsighthub",
    audience: "cryptoinsighthub-web",
  }) as jwt.JwtPayload & SessionPayload;
  return {
    sub: Number(decoded.sub),
    email: decoded.email,
    username: decoded.username,
  };
}
