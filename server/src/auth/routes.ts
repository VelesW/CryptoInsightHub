import { Router } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
import { config } from "../config.js";
import { userQueries } from "../db.js";
import { signSession } from "./jwt.js";
import { issueCsrfToken } from "./csrf.js";
import { requireAuth } from "./middleware.js";
import { loginSchema, registerSchema } from "./validation.js";

const BCRYPT_ROUNDS = 12;

// Tight limit on credential endpoints to slow brute force / enumeration.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many attempts. Try again later." },
});

function setSessionCookie(
  res: import("express").Response,
  token: string,
) {
  res.cookie(config.sessionCookie, token, {
    httpOnly: true,
    secure: config.isProd,
    sameSite: "strict",
    path: "/",
    maxAge: config.jwtTtlSeconds * 1000,
  });
}

function clearSessionCookie(res: import("express").Response) {
  res.clearCookie(config.sessionCookie, {
    httpOnly: true,
    secure: config.isProd,
    sameSite: "strict",
    path: "/",
  });
}

export const authRouter = Router();

// Bootstrap endpoint the SPA hits on load to receive a CSRF token cookie.
authRouter.get("/csrf", (_req, res) => {
  const token = issueCsrfToken(res);
  res.json({ csrfToken: token });
});

authRouter.post("/register", authLimiter, async (req, res) => {
  let input;
  try {
    input = registerSchema.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: err.flatten().fieldErrors });
    }
    throw err;
  }

  const existing = userQueries.findByEmail.get(input.email);
  if (existing) {
    // Generic message — do not leak whether email or username exists.
    return res.status(409).json({ error: "Account could not be created" });
  }

  const hash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  try {
    const result = userQueries.insert.run(input.email, input.username, hash);
    const userId = Number(result.lastInsertRowid);
    const token = signSession({
      sub: userId,
      email: input.email,
      username: input.username,
    });
    setSessionCookie(res, token);
    issueCsrfToken(res); // rotate
    res.status(201).json({
      user: { id: userId, email: input.email, username: input.username },
    });
  } catch (e: unknown) {
    // UNIQUE constraint on username collides — same generic message.
    if (
      e instanceof Error &&
      "code" in e &&
      (e as { code: string }).code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return res.status(409).json({ error: "Account could not be created" });
    }
    throw e;
  }
});

authRouter.post("/login", authLimiter, async (req, res) => {
  let input;
  try {
    input = loginSchema.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    throw err;
  }

  const user = userQueries.findByEmail.get(input.email);

  // Always run bcrypt.compare to keep timing roughly constant whether or
  // not the email exists (prevents user enumeration via timing).
  const dummyHash =
    "$2b$12$CwTycUXWue0Thq9StjUM0uJ8jVqf6P9mB1Hf0/9c6nUUR6oOq5xVm";
  const ok = await bcrypt.compare(
    input.password,
    user?.password_hash ?? dummyHash,
  );

  if (!user || !ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signSession({
    sub: user.id,
    email: user.email,
    username: user.username,
  });
  setSessionCookie(res, token);
  issueCsrfToken(res); // rotate on auth state change
  res.json({
    user: { id: user.id, email: user.email, username: user.username },
  });
});

authRouter.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  issueCsrfToken(res); // rotate on auth state change
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, (req, res) => {
  const u = req.user!;
  res.json({ user: { id: u.sub, email: u.email, username: u.username } });
});
