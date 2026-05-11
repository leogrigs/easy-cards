"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthContext";
import { LayoutDashboard, LogOut, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../public/logo.png";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Explore",
    url: "/explore",
    icon: Search,
  },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  // },
];

export function AppSidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="min-h-screen">
      {/* Sidebar Content */}
      <SidebarContent>
        {/* Branding */}
        <SidebarGroup>
          <SidebarGroupLabel className="mb-4 mt-4 flex items-center space-x-2 px-4 text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Image src={Logo} width={16} height={16} alt="Logo" />
              <span>Easy Cards</span>
            </Link>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Navigation Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        href={item.url}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex items-center space-x-2 rounded-md px-4 py-2 transition-colors",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="mb-8 flex items-center space-x-2 rounded-md px-4 py-2 text-red-600 transition-colors hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-800"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
