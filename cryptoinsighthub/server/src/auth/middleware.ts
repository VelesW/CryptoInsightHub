import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { verifySession, type SessionPayload } from "./jwt.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: SessionPayload;
    }
  }
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.[config.sessionCookie];
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    req.user = verifySession(token);
    next();
  } catch {
    res.status(401).json({ error: "Session expired" });
  }
}

export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.[config.sessionCookie];
  if (!token) return next();
  try {
    req.user = verifySession(token);
  } catch {
    /* ignore — treat as anonymous */
  }
  next();
}
