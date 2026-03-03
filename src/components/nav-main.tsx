// "use client";

// import { ChevronRight, type LucideIcon } from "lucide-react";

// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import {
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
// } from "@/components/ui/sidebar";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export function NavMain({
//   items,
// }: {
//   items: {
//     title: string;
//     url: string;
//     icon?: LucideIcon;
//     isActive?: boolean;
//   }[];
// }) {
//   const href = usePathname();
//   return (
//     <SidebarGroup>
//       {/* <SidebarGroupLabel>Main</SidebarGroupLabel> */}
//       <SidebarMenu>
//         {items.map((item) => (
//           <SidebarMenuItem key={item.title}>
//             <Link href={item?.url}>
//               <SidebarMenuButton isActive={checkIsActive(href, item)}>
//                 <SidebarMenuButton tooltip={item.title}>
//                   {item.icon && <item.icon />}
//                   <span>{item.title}</span>
//                 </SidebarMenuButton>
//               </SidebarMenuButton>
//             </Link>
//           </SidebarMenuItem>
//         ))}
//       </SidebarMenu>
//     </SidebarGroup>
//   );
// }

// function checkIsActive(href: string, item: any, mainNav = false) {
//   return (
//     href === item.url || // /endpint?search=param
//     href.split("?")[0] === item.url || // endpoint
//     !!item?.items?.filter((i: { url: string }) => i.url === href).length || // if child nav is active
//     (mainNav &&
//       href.split("/")[1] !== "" &&
//       href.split("/")[1] === item?.url?.split("/")[1])
//   );
// }



"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  items?: {
    title: string;
    url: string;
  }[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) =>
          item.items ? (
            /* 🔥 Parent With Submenu */
            <Collapsible key={item.title} defaultOpen={isParentActive(pathname, item)}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={isParentActive(pathname, item)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((sub) => (
                      <SidebarMenuSubItem key={sub.title}>
                        <Link href={sub.url}>
                          <SidebarMenuSubButton
                            isActive={pathname === sub.url}
                          >
                            {sub.title}
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            /* 🔥 Single Menu Item */
            <SidebarMenuItem key={item.title}>
              <Link href={item.url!}>
                <SidebarMenuButton
                  isActive={pathname === item.url}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

/* ---------------- Helper Functions ---------------- */

function isParentActive(pathname: string, item: NavItem) {
  if (!item.items) return false;
  return item.items.some((sub) => pathname === sub.url);
}
