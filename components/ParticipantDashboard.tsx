'use client'

import { QRCodeCanvas } from 'qrcode.react';
import { useRef } from 'react';
import ParticipantSidebar from "@/components/ParticipantSidebar"; // <--- Import this

type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export default function ParticipantDashboard({ profile }: { profile: UserProfile }) {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `vscan-qr-${profile.full_name}.png`;
      a.click();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      
      {/* SIDEBAR - Replaced with Component */}
      <ParticipantSidebar profile={profile} />

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-72 p-6 lg:p-10">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My QR Code</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal attendance QR code.</p>
            </div>
            {/* Search Bar (Visual Only for now) */}
            <div className="relative w-full md:w-64">
                <input type="text" placeholder="Search event..." className="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"/>
                <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
        </header>

        {/* ... Keep the rest of your GRID LAYOUT and CARDS exactly as they were ... */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10"></div>
                    <div className="relative z-10 mt-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Scan to Check-in</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Show this code to the event organizer.</p>
                        
                        <div ref={qrRef} className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 inline-block mb-8">
                            <QRCodeCanvas 
                                value={profile.id} 
                                size={220}
                                level={"H"} 
                                includeMargin={true}
                            />
                            <div className="mt-2 text-xs font-mono text-gray-400 uppercase tracking-widest">ID: {profile.id.slice(0, 8)}...</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto">
                            <button onClick={downloadQR} className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white dark:bg-[#111] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Profile Info
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Full Name</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{profile.full_name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{profile.email}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Account Role</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mt-1 capitalize">
                                {profile.role}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            How it works
                        </h3>
                        <ul className="space-y-3 text-sm text-indigo-100">
                            <li className="flex gap-2">
                                <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                                Arrive at the event venue.
                            </li>
                            <li className="flex gap-2">
                                <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                                Show this QR code to the scanner.
                            </li>
                            <li className="flex gap-2">
                                <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                                Wait for the "Success" beep!
                            </li>
                        </ul>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}