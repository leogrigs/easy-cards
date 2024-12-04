import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-100 dark:bg-zinc-950">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1">
          <SidebarTrigger className="dark: text-white" />
          <div className="p-1 md:p-4">{children}</div>
        </div>
      </SidebarProvider>
    </div>
  );
}
