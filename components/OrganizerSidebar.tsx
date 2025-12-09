'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, QrCode, Users } from "lucide-react";
import SignOutButton from "./SignOutButton";

type UserProfile = {
  full_name: string;
  email: string;
  role: string;
}

export default function OrganizerSidebar({ profile }: { profile: UserProfile }) {
  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 h-screen fixed top-0 left-0 z-30">
        <div className="p-8 flex items-center gap-4">
           <div className="grid grid-cols-2 gap-1 w-10 h-10 shadow-lg shadow-purple-500/20 rounded-lg p-1 bg-white dark:bg-black/50">
               <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-sm"></div>
               <div className="border-2 border-purple-500 rounded-sm"></div>
               <div className="bg-purple-500/50 rounded-sm"></div>
               <div className="bg-gradient-to-tl from-cyan-400 to-blue-500 rounded-sm"></div>
          </div>
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            VSCAN
          </span>
        </div>

        <nav className="flex-1 px-6 space-y-3 mt-4">
          <Link href="/" className="w-full">
            <Button variant="ghost" className="w-full justify-start h-12 gap-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all">
                <CalendarDays className="w-5 h-5" />
                Dashboard
            </Button>
          </Link>
          
          <Link href="/events" className="w-full">
            <Button variant="ghost" className="w-full justify-start h-12 gap-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all">
                <QrCode className="w-5 h-5" />
                Manage Events
            </Button>
          </Link>

          <Button variant="ghost" className="w-full justify-start h-12 gap-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all">
            <Users className="w-5 h-5" />
            Attendees
          </Button>
        </nav>

        {/* User Profile */}
        <div className="mt-auto p-6 border-t border-gray-200/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-black/20">
            <SignOutButton profile={profile} />
        </div>
      </aside>
  );
}