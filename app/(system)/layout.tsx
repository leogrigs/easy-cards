import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LoaderProvider } from "@/providers/LoaderContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-100 dark:bg-zinc-950">
      <LoaderProvider>
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1">
            <SidebarTrigger className="dark: text-white" />
            <div className="p-1 md:p-4">{children}</div>
          </div>
        </SidebarProvider>
      </LoaderProvider>
    </div>
  );
}
