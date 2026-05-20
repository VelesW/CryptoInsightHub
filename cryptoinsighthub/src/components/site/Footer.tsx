import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-md text-xs text-muted-foreground">
            © 2024 CryptoInsight Hub. High-risk investment warning: Blockchain assets are volatile.
          </p>
        </div>
        <ul className="flex flex-wrap gap-6 text-xs text-muted-foreground">
          {["Legal", "Privacy", "Risk Disclosure", "Discord", "Github"].map((l) => (
            <li key={l}>
              <a href="#" className="underline-offset-4 hover:text-foreground hover:underline">
                {l}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
