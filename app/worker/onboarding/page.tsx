// app/worker/onboarding/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";
import WorkerOnboardClient from "./worker-onboard-client";

export const dynamic = "force-dynamic";

export default async function WorkerOnboardingPage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin?mode=worker");

  // If already verified worker → kick out
  const { data: w } = await supabase
    .from("workers")
    .select("id, verified, service_type, phone, areas, bio")
    .eq("user_id", user.id)
    .maybeSingle();

  if (w?.verified) redirect("/");

  return (
    <main className="min-h-[calc(100dvh-80px)] w-full grid place-items-center px-4">
      <div className="w-full max-w-2xl">
        <WorkerOnboardClient
          email={user.email ?? ""}
          initial={{
            id: w?.id ?? null,
            verified: !!w?.verified,
            service_type: (w?.service_type as string | null) ?? null,
            phone: (w?.phone as string | null) ?? "",
            areas: (w?.areas as string[] | null) ?? [],
            bio: (w?.bio as string | null) ?? "",
          }}
        />
      </div>
    </main>
  );
}
