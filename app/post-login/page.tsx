// app/post-login/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function PostLoginPage({
  searchParams,
}: {
  searchParams: { mode?: "user" | "worker" };
}) {
  const mode = searchParams.mode === "worker" ? "worker" : "user";

  const supabase = createSupabaseServer();

  // 1) make sure we have a session
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/signin?mode=${mode}`);

  // 2) ensure profiles row exists (optional but nice)
  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? "",
    },
    { onConflict: "id" }
  );

  if (mode === "user") {
    redirect("/");
  }

  // mode === 'worker'
  // 3) check worker row
  const { data: worker } = await supabase
    .from("workers")
    .select("id, verified")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!worker) {
    redirect("/worker/onboarding");
  }

  // already has worker row; return home (or dashboard later)
  redirect("/");
}
