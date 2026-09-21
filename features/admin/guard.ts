import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

// Server-action guard. Mutations call this before touching the database, so the
// data layer is protected even independently of the route middleware.
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}
