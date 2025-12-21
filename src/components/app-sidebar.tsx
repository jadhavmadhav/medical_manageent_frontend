"use client";

import {
  Boxes,
  ChartNoAxesCombined,
  FileBadge2,
  FileText,
  Home,
  Landmark,
  Layers3,
  LayoutDashboard,
  PlusSquare,
  RotateCcw,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"; // ✅ added icons
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import logo from "@/assets/MedTraxLogo.png";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/shadcn.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: Layers3,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: Landmark,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Home,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "New Sale Entry",
      url: "/new-sale-entry",
      icon: PlusSquare,
    },
    {
      title: "Patient Bills",
      url: "/patient-bills",
      icon: FileText,
    },
    {
      title: "Sales",
      url: "/sales",
      icon: TrendingUp,
    },
    {
      title: "Return Bills",
      url: "/return-inventory",
      icon: RotateCcw,
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: Boxes,
    },
    {
      title: "Purchase Bills",
      url: "/purchase-bills",
      icon: FileBadge2,
    },
    {
      title: "New Purchase",
      url: "/new-purchase",
      icon: ShoppingCart,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: ChartNoAxesCombined,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-16 flex flex-row items-center gap-2 px-2 border-b   border-r-0">
        {/* LOGO */}
        <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden bg-white">
          <Image
            src={logo}
            alt="MedTrax"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* BRAND NAME */}
        <div className="min-w-0 flex-1">
          <span className="block text-xl font-bold  truncate">
            MedTrax
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
       <SidebarFooter className="text-center gap-0">
        <div className="text-muted-foreground  ">
          Powered by MedTrax
        </div>
        <div  className="text-xs text-muted-foreground">
          Version 1.0.0
        </div>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter> 
      <SidebarRail />
    </Sidebar>
  );
}
