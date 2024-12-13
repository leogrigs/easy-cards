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

  return (
    <Sidebar collapsible="icon" className="min-h-screen">
      {/* Sidebar Content */}
      <SidebarContent>
        {/* Branding */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center space-x-2 text-lg font-semibold text-indigo-600 dark:text-indigo-400 px-4 mt-4 mb-4">
            <Image src={Logo} width={16} height={16} alt="Logo" />
            <span>Easy Cards</span>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Navigation Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                        "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
              className="flex items-center mb-8 space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
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
