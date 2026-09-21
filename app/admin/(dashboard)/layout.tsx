import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/features/admin/AdminSidebar";
import { logoutAction } from "../actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-ivory lg:grid lg:grid-cols-[260px_1fr]">
      <AdminSidebar userName={session.name} logout={logoutAction} />
      <div className="min-w-0">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-14">
          {children}
        </div>
      </div>
    </div>
  );
}
