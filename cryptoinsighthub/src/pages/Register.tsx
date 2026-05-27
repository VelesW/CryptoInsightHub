import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Lock, Mail, UserPlus, User } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePassword(p: string): string | null {
  if (p.length < 12) return "Password must be at least 12 characters.";
  if (p.length > 128) return "Password is too long.";
  if (!/[a-z]/.test(p)) return "Add a lowercase letter.";
  if (!/[A-Z]/.test(p)) return "Add an uppercase letter.";
  if (!/[0-9]/.test(p)) return "Add a digit.";
  if (!/[^a-zA-Z0-9]/.test(p)) return "Add a symbol.";
  return null;
}

export default function RegisterPage() {
  usePageMeta(
    "Create Account — CryptoInsight Hub",
    "Register for CryptoInsight Hub.",
  );
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    if (!EMAIL_PATTERN.test(cleanEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (
      cleanUsername.length < 3 ||
      cleanUsername.length > 32 ||
      !USERNAME_PATTERN.test(cleanUsername)
    ) {
      setError("Username: 3–32 chars, letters/digits/_.- only.");
      return;
    }
    const pwErr = validatePassword(password);
    if (pwErr) {
      setError(pwErr);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await register(cleanEmail, cleanUsername, password);
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError("Too many attempts. Please wait and try again.");
      } else if (err instanceof ApiError && err.status === 409) {
        setError("That email or username is unavailable.");
      } else if (err instanceof ApiError) {
        setError(err.message || "Registration failed.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 glow-aurora-soft opacity-60" />
        <div className="relative mx-auto max-w-md px-6 py-20">
          <div className="panel p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber/15 text-amber">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-semibold">
                  Create account
                </h1>
                <p className="text-sm text-muted-foreground">
                  Join the terminal.
                </p>
              </div>
            </div>

            <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
              <Field
                id="email"
                label="Email"
                icon={<Mail className="h-4 w-4" />}
                value={email}
                onChange={setEmail}
                type="email"
                autoComplete="email"
                required
                maxLength={254}
              />
              <Field
                id="username"
                label="Username"
                icon={<User className="h-4 w-4" />}
                value={username}
                onChange={setUsername}
                autoComplete="username"
                required
                maxLength={32}
                help="3–32 chars: letters, digits, _ . -"
              />
              <Field
                id="password"
                label="Password"
                icon={<Lock className="h-4 w-4" />}
                value={password}
                onChange={setPassword}
                type="password"
                autoComplete="new-password"
                required
                maxLength={128}
                help="Min 12 chars with upper, lower, digit, symbol."
              />
              <Field
                id="confirm"
                label="Confirm password"
                icon={<Lock className="h-4 w-4" />}
                value={confirm}
                onChange={setConfirm}
                type="password"
                autoComplete="new-password"
                required
                maxLength={128}
              />

              {error && (
                <div
                  role="alert"
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  id,
  label,
  icon,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
  maxLength,
  help,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
  help?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium tracking-[0.12em] text-muted-foreground"
      >
        {label.toUpperCase()}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          maxLength={maxLength}
          className="w-full rounded-md border border-border bg-surface-2/60 px-9 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>
      {help && (
        <p className="mt-1.5 text-[11px] text-muted-foreground">{help}</p>
      )}
    </div>
  );
}
