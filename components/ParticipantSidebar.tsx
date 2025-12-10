'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SignOutButton from "./SignOutButton";
import { QrCode, User, CalendarDays } from "lucide-react";

type UserProfile = {
  full_name: string;
  email: string;
  role: string;
}

export default function ParticipantSidebar({ profile }: { profile: UserProfile }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-[#111] border-r border-gray-200 dark:border-gray-800 h-screen fixed top-0 left-0 z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="grid grid-cols-2 gap-0.5 w-8 h-8">
             <div className="bg-cyan-600 rounded-sm"></div>
             <div className="border-2 border-cyan-600 rounded-sm"></div>
             <div className="bg-cyan-600 rounded-sm opacity-50"></div>
             <div className="bg-cyan-600 rounded-sm"></div>
        </div>
        <span className="text-xl font-bold tracking-wider text-gray-900 dark:text-white">VSCAN</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link 
          href="/" 
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
            isActive('/') 
              ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/50" 
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
        >
          <QrCode className="w-5 h-5" />
          My QR Code
        </Link>
        
        <Link 
          href="/settings" 
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
            isActive('/settings') 
              ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/50" 
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
        >
          <User className="w-5 h-5" />
          Profile & Settings
        </Link>

        {/* ACTIVATED LINK */}
        <Link 
          href="/my-events" 
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
            isActive('/my-events') 
              ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/50" 
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
        >
          <CalendarDays className="w-5 h-5" />
          Events History
        </Link>
      </nav>

      <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
          <SignOutButton profile={profile} />
      </div>
    </aside>
  );
}