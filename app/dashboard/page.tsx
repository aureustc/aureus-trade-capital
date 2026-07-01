import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

function DashboardLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-[var(--bg-primary)]">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardClient />
    </Suspense>
  );
}
