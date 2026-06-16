import { SiteLayout } from "@/components/site/SiteLayout";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  usePageMeta("Dashboard — CryptoInsight Hub");
  const { user } = useAuth();
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="font-display text-3xl font-semibold">
          Welcome, {user?.displayName}
        </h1>
        <p className="mt-4 text-muted-foreground">
          This route is protected — only authenticated users can see it.
        </p>
      </section>
    </SiteLayout>
  );
}
