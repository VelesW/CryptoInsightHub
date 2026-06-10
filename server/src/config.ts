import "dotenv/config";

function required(name: string): string {
  const v = process.env[name];
  if (!v || v.length === 0) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProd: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: required("JWT_SECRET"),
  corsOrigins: (process.env.CORS_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  dbPath: process.env.DB_PATH ?? "./data/app.db",

  // JWT access token lifetime in seconds
  jwtTtlSeconds: 60 * 60 * 2, // 2h

  // Cookie names
  sessionCookie: "cih_session",
  csrfCookie: "cih_csrf",
  csrfHeader: "x-csrf-token",
};

if (config.jwtSecret.length < 32) {
  // Catch obvious misconfiguration before it ships.
  throw new Error("JWT_SECRET must be at least 32 characters");
}
