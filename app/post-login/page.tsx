// app/post-login/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function PostLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: "user" | "worker" }>;
}) {
  // searchParams adalah Promise → await
  const sp = await searchParams;
  const mode: "user" | "worker" = sp.mode === "worker" ? "worker" : "user";

  const supabase = createSupabaseServer();

  // 1) pastikan ada session
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/signin?mode=${mode}`);

  // 2) pastikan row profiles ada
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

  // mode === "worker"
  // 3) cek row workers
  const { data: worker } = await supabase
    .from("workers")
    .select("id, verified")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!worker) {
    redirect("/worker/onboarding");
  }

  // sudah punya row worker → ke beranda (atau dashboard nantinya)
  redirect("/");
}
