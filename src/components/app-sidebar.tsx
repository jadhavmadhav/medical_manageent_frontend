// "use client";

// import * as React from "react";
// import {
//   AudioWaveform,
//   Command,
//   Frame,
//   GalleryVerticalEnd,
//   Map,
//   PieChart,
//   LayoutDashboard,
//   Undo2,
//   FilePlus2,
//   Layers3,
//   Landmark,
//   Home,
//   PlusSquare,
//   FileText,
//   TrendingUp,
//   RotateCcw,
//   Boxes,
// } from "lucide-react";

// import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";
// import { NavUser } from "@/components/nav-user";
// import { TeamSwitcher } from "@/components/team-switcher";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarRail,
// } from "@/components/ui/sidebar";
// import { title } from "process";

  


// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/shadcn.png",
//   },
//   teams: [
//     {
//       name: "Acme Inc",
//       logo: Layers3,
//       plan: "Enterprise",
//     },
//     {
//       name: "Acme Corp.",
//       logo: Landmark,
//       plan: "Startup",
//     },
//     {
//       name: "Evil Corp.",
//       logo: Home,
//       plan: "Free",
//     },
//   ],
//   navMain: [
//     {
//       title: "Dashboard",
//       url: "/dashboard",
//       icon: Home,
//       isActive: true,
//     },
//     {
//       title: "New Sale Entry",
//       url: "/new-sale-entry",
//       icon: PlusSquare,
//     },
//     {
//       title: "Patient Bills",
//       url: "/patient-bills",
//       icon: FileText,
//     },
//     {
//       title: "Sales",
//       url: "/sales",
//       icon: TrendingUp,
//     },
//     {
//       title: "Return Inventories",
//       url: "/return-inventory",
//       icon: RotateCcw,
//     },
//     {
//       title: "Inventory",
//       url: "/inventory",
//       icon: Boxes,
//     },
//     {
//       title:"Add Inventory",
//       url:"/add-inventory",
//       icon: 
//     },
//     {
//       title:"Purchase Bills",
//       url:"/purchase-bills"
//     },
//     {
//       title:"New Purchase",
//       url:"/new-purchase"
//     }
//   ],
//   projects: [
//     {
//       name: "Design Engineering",
//       url: "#",
//       icon: Layers3,
//     },
//     {
//       name: "Sales & Marketing",
//       url: "#",
//       icon: TrendingUp,
//     },
//     {
//       name: "Travel",
//       url: "#",
//       icon: Landmark,
//     },
//   ],
// };


// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader>
//         <TeamSwitcher teams={data.teams} />
//       </SidebarHeader>
//       <SidebarContent>
//         <NavMain items={data.navMain} />
//         <NavProjects projects={data.projects} />
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={data.user} />
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   );
// }









"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  LayoutDashboard,
  Undo2,
  FilePlus2,
  Layers3,
  Landmark,
  Home,
  PlusSquare,
  FileText,
  TrendingUp,
  RotateCcw,
  Boxes,
  PackagePlus,
  FileBadge2,
  ShoppingCart,
} from "lucide-react"; // ✅ added icons

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

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
      title: "Return Inventories",
      url: "/return-inventory",
      icon: RotateCcw,
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: Boxes,
    },
    {
      title: "Add Inventory",
      url: "/add-inventory",
      icon: PackagePlus, 
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
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Layers3,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: TrendingUp,
    },
    {
      name: "Travel",
      url: "#",
      icon: Landmark,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
