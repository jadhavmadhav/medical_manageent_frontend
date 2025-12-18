"use client"

import * as React from "react"

import logo from "@/assets/MedTrax.png"
import {
  SidebarMenu,
  useSidebar
} from "@/components/ui/sidebar"
import Image from "next/image"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
       <Image alt="" src={logo} fill />
    </SidebarMenu>
  )
}
