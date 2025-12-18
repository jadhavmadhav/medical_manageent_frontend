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
import logo  from "@/assets/MedTrax.png";

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
       <SidebarHeader className="h-16 flex items-center border-b">
        <div className="relative bg-white h-full w-full py-2">
          <Image
            src={logo}
            alt="MedTrax"
            fill
            className="object-cover"
            priority
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
