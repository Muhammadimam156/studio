'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Sparkles, Library, Bot, Text, Lightbulb, Presentation, Target, Code, Palette } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AppSidebar() {
  const pathname = usePathname();
  const startupGeneratorOpen = pathname.startsWith('/startup-generator');

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 font-headline font-semibold text-lg">
          <Bot className="h-7 w-7 text-primary" />
          <span>Startup AI</span>
        </Link>
      </SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Home">
            <Link href="/">
              <Sparkles />
              <span>Home</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <Accordion type="single" collapsible defaultValue={startupGeneratorOpen ? "item-1" : ""}>
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="flex items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg:first-child]:size-4 [&>svg:first-child]:shrink-0 [&>svg:last-child]:ml-auto">
              <Lightbulb />
              <span>Startup Toolkit</span>
            </AccordionTrigger>
            <AccordionContent className="ml-7 flex flex-col gap-1 border-l border-sidebar-border pl-4 pr-2 pt-1">
              <SidebarMenuButton asChild isActive={pathname === '/startup-generator/names-taglines'} variant="ghost" size="sm" className="justify-start">
                  <Link href="/startup-generator/names-taglines">
                      Names & Taglines
                  </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild isActive={pathname === '/startup-generator/elevator-pitch'} variant="ghost" size="sm" className="justify-start">
                  <Link href="/startup-generator/elevator-pitch">
                      Elevator Pitch
                  </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild isActive={pathname === '/startup-generator/problem-solution'} variant="ghost" size="sm" className="justify-start">
                  <Link href="/startup-generator/problem-solution">
                      Problem/Solution
                  </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild isActive={pathname === '/startup-generator/audience-uvp'} variant="ghost" size="sm" className="justify-start">
                  <Link href="/startup-generator/audience-uvp">
                      Audience & UVP
                  </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild isActive={pathname === '/startup-generator/hero-copy'} variant="ghost" size="sm" className="justify-start">
                  <Link href="/startup-generator/hero-copy">
                      Website Hero Copy
                  </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild isActive={pathname === '/startup-generator/logo-colors'} variant="ghost" size="sm" className="justify-start">
                  <Link href="/startup-generator/logo-colors">
                      Color/Logo Ideas
                  </Link>
              </SidebarMenuButton>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === '/text-generator'} tooltip="Text Generator">
            <Link href="/text-generator">
              <Text />
              <span>Text Generator</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === '/library'} tooltip="My Library">
            <Link href="/library">
              <Library />
              <span>Library</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </Sidebar>
  );
}
