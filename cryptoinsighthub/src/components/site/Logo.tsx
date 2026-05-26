import { Link } from "react-router-dom";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2.5 ${className}`}
      aria-label="CryptoInsight Hub Home"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        className="text-primary"
        aria-hidden
      >
        <path
          d="M12 2L21 7v10l-9 5-9-5V7l9-5z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      </svg>
      <span className="font-display text-[13px] font-semibold tracking-[0.18em] text-primary">
        CRYPTOINSIGHT HUB
      </span>
    </Link>
  );
}
