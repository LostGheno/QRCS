import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import ParticipantSidebar from "@/components/ParticipantSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Clock, ArrowRight } from "lucide-react";

export default async function MyEventsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect("/login");

  const { data: attendanceRecords } = await supabase
    .from('attendance')
    .select(`
      id,
      check_in_time,
      check_out_time,
      status,
      events (
        id,
        title,
        location,
        start_time,
        end_time,
        cover_image_url
      )
    `)
    .eq('user_id', user.id)
    .order('check_in_time', { ascending: false });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <ParticipantSidebar profile={profile} />

      <div className="flex-1 lg:ml-72 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto p-6 lg:p-10 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Event History</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Track the events you have attended.</p>
            </div>

            <div className="grid gap-6">
                {attendanceRecords && attendanceRecords.length > 0 ? (
                    attendanceRecords.map((record: any) => (
                        <Card key={record.id} className="overflow-hidden border-0 shadow-lg bg-white dark:bg-[#111] group hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col md:flex-row">
                                {/* Event Image */}
                                <div className="w-full md:w-48 h-32 md:h-auto relative bg-gray-200 dark:bg-gray-800">
                                    {record.events?.cover_image_url ? (
                                        <img 
                                            src={record.events.cover_image_url} 
                                            alt={record.events.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <CalendarDays className="w-8 h-8 opacity-50" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2">
                                        {record.status === 'checked-in' ? (
                                            <Badge className="bg-green-500 hover:bg-green-600 border-0">Live</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-gray-900/50 text-white backdrop-blur-sm">Completed</Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="flex-1 p-6 flex flex-col justify-center">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {record.events?.title || "Unknown Event"}
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-cyan-500" />
                                            {record.events?.location}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-cyan-500" />
                                            {new Date(record.check_in_time).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                                        <div className="text-xs font-mono text-gray-400">
                                            Check-in: {new Date(record.check_in_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        {record.check_out_time && (
                                            <div className="text-xs font-mono text-gray-400">
                                                Out: {new Date(record.check_out_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-[#111] rounded-2xl border border-dashed border-gray-300 dark:border-gray-800">
                        <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No attendance records yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Scan into an event to see it appear here!</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}