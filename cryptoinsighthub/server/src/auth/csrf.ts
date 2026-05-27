import { randomBytes, timingSafeEqual } from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

// Double-submit cookie pattern:
// - Server sets a readable cookie containing a random CSRF token.
// - For any state-changing request the client must echo the same token
//   in an X-CSRF-Token header. An attacker on another origin can fire
//   credentialed requests but cannot read the cookie, so cannot supply
//   the header.

export function issueCsrfToken(res: Response): string {
  const token = randomBytes(32).toString("hex");
  res.cookie(config.csrfCookie, token, {
    httpOnly: false, // intentionally readable by JS
    secure: config.isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24,
  });
  return token;
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function csrfProtection(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (SAFE_METHODS.has(req.method)) return next();

  const cookieToken = req.cookies?.[config.csrfCookie];
  const headerToken = req.header(config.csrfHeader);

  if (
    !cookieToken ||
    !headerToken ||
    cookieToken.length !== headerToken.length
  ) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }

  const a = Buffer.from(cookieToken);
  const b = Buffer.from(headerToken);
  if (!timingSafeEqual(a, b)) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  next();
}
