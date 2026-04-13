import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("rol, nombre, email")
    .eq("id", user.id)
    .single();

  if (usuario?.rol !== "super_admin") redirect("/");

  return (
    <div style={{ minHeight: "100vh" }}>
      <AdminNav nombre={usuario.nombre} email={usuario.email} />
      {children}
    </div>
  );
}
