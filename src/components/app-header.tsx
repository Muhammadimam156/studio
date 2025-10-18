'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { Bot } from "lucide-react";

export function AppHeader() {
  const { isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      {isMobile && (
        <>
          <SidebarTrigger />
          <Link href="/" className="flex items-center gap-2 font-headline font-semibold text-lg">
            <Bot className="h-7 w-7 text-primary" />
            <span>Startup AI</span>
          </Link>
        </>
      )}
      <div className="flex-1" />
      <UserNav />
    </header>
  );
}
