import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LogIn, Lock, Mail } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

interface LocationState {
  from?: string;
}

export default function LoginPage() {
  usePageMeta(
    "Sign In — CryptoInsight Hub",
    "Access your CryptoInsight Hub dashboard.",
  );
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to={from} replace />;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      await login(trimmedEmail, password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError("Too many attempts. Please wait and try again.");
      } else if (err instanceof ApiError) {
        setError(err.message || "Sign-in failed.");
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
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <LogIn className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-semibold">
                  Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                  Sign in to your terminal.
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
                id="password"
                label="Password"
                icon={<Lock className="h-4 w-4" />}
                value={password}
                onChange={setPassword}
                type="password"
                autoComplete="current-password"
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
                {submitting ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              No account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Create one
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
