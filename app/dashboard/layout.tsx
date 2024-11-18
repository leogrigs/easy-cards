import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1">
          <SidebarTrigger />
          <div>{children}</div>
        </div>
      </SidebarProvider>
    </div>
  );
}
