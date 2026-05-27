import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import { csrfProtection } from "./auth/csrf.js";
import { authRouter } from "./auth/routes.js";
import { requireAuth } from "./auth/middleware.js";

const app = express();

// Behind a TLS-terminating proxy in production. Required for secure cookies
// and accurate rate-limit IP detection.
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: config.isProd ? undefined : false,
    crossOriginResourcePolicy: { policy: "same-site" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
);
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

// Global low ceiling. Auth-specific limits in routes.ts are tighter.
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

// CSRF on all state-changing requests (csrf.ts skips safe methods).
app.use(csrfProtection);

app.use("/api/auth", authRouter);

// Example protected resource.
app.get("/api/profile", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// Last-resort error handler. Never leak stack traces to the client.
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("[server error]", err);
    res.status(500).json({ error: "Internal server error" });
  },
);

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
