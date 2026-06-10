import type { ReactNode } from "react";

export function AuthField({
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
  icon: ReactNode;
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
