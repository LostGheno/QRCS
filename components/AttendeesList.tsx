'use client'

import { useState, useMemo } from "react"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, ArrowRight, Clock, CalendarDays, FilterX } from "lucide-react"
import { Button } from "@/components/ui/button"

// Updated Types to match your DB schema
type AttendeeRecord = {
  id: string
  check_in_time: string        
  check_out_time: string | null 
  status: string
  profiles: {
    full_name: string
    email: string
    avatar_url?: string 
  } | null
  events: {
    id: string // Need ID for reliable filtering
    title: string
    location?: string
  } | null
}

export default function AttendeesList({ initialData }: { initialData: AttendeeRecord[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all") // <--- New State

  // 1. Extract Unique Events for the Dropdown
  const uniqueEvents = useMemo(() => {
    const eventsMap = new Map();
    initialData.forEach(item => {
      if (item.events) {
        eventsMap.set(item.events.id, item.events.title);
      }
    });
    return Array.from(eventsMap.entries()).map(([id, title]) => ({ id, title }));
  }, [initialData]);

  // 2. Updated Filter Logic
  const filteredAttendees = initialData.filter(record => {
    // Search Text
    const searchLower = searchTerm.toLowerCase()
    const nameMatch = record.profiles?.full_name.toLowerCase().includes(searchLower)
    const emailMatch = record.profiles?.email.toLowerCase().includes(searchLower)
    
    // Status Filter
    const matchesStatus = statusFilter === "all" ? true : record.status === statusFilter

    // Event Filter (New)
    const matchesEvent = eventFilter === "all" ? true : record.events?.id === eventFilter

    return (nameMatch || emailMatch) && matchesStatus && matchesEvent
  })

  // Helper to reset all filters
  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setEventFilter("all")
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return <span className="text-gray-300 dark:text-gray-700 text-xs">--:--</span>;
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const getInitials = (name: string) => name?.substring(0, 2).toUpperCase() || "??";

  return (
    <div className="space-y-6">
      
      {/* FILTER BAR */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between bg-white dark:bg-[#111] p-1.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        
        {/* Search Input */}
        <div className="relative w-full lg:w-96 group">
            <div className="absolute left-3 top-3 p-0.5 bg-gray-100 dark:bg-gray-800 rounded-md">
                <Search className="h-3.5 w-3.5 text-gray-500" />
            </div>
            <Input 
                placeholder="Search participants..." 
                className="pl-12 h-11 border-0 bg-transparent focus-visible:ring-0 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
            
            {/* EVENT FILTER (NEW) */}
            <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger className="w-full sm:w-[200px] h-11 border-0 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-0 rounded-xl transition-colors">
                    <div className="flex items-center gap-2 truncate">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        <span className="truncate">
                            {eventFilter === 'all' ? 'All Events' : uniqueEvents.find(e => e.id === eventFilter)?.title}
                        </span>
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    {uniqueEvents.map(event => (
                        <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* STATUS FILTER */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[160px] h-11 border-0 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-0 rounded-xl transition-colors">
                    <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="checked-in">🟢 Present</SelectItem>
                    <SelectItem value="checked-out">⚪ Checked Out</SelectItem>
                </SelectContent>
            </Select>

            {/* CLEAR FILTERS BUTTON (Only shows if filters are active) */}
            {(searchTerm || statusFilter !== 'all' || eventFilter !== 'all') && (
                <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={clearFilters}
                    className="h-11 w-11 rounded-xl hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                    title="Clear filters"
                >
                    <FilterX className="w-5 h-5" />
                </Button>
            )}
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/80 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[300px] pl-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Participant</TableHead>
              <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Event</TableHead>
              <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">In</TableHead>
              <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Out</TableHead>
              <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right pr-8">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-3">
                        <FilterX className="w-6 h-6 opacity-50" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">No results found</p>
                    <p className="text-sm opacity-60 max-w-xs mx-auto mt-1">
                        We couldn't find any attendees matching your current filters.
                    </p>
                    <Button variant="link" onClick={clearFilters} className="mt-2 text-indigo-500">
                        Clear all filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAttendees.map((record) => (
                <TableRow key={record.id} className="group border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  
                  {/* PARTICIPANT */}
                  <TableCell className="pl-8 py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
                        <AvatarImage src={record.profiles?.avatar_url} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/50 dark:to-blue-900/50 text-indigo-600 dark:text-indigo-300 font-bold text-xs">
                            {getInitials(record.profiles?.full_name || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                            {record.profiles?.full_name || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {record.profiles?.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* EVENT */}
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                            {record.events?.title}
                        </span>
                        {record.events?.location && (
                            <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" /> {record.events.location}
                            </span>
                        )}
                    </div>
                  </TableCell>

                  {/* CHECK IN TIME */}
                  <TableCell className="text-center">
                    <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                        <Clock className="w-3 h-3 text-green-600 mr-1.5" />
                        <span className="font-mono text-xs font-semibold text-green-700 dark:text-green-400">
                            {formatTime(record.check_in_time)}
                        </span>
                    </div>
                  </TableCell>

                  {/* CHECK OUT TIME */}
                  <TableCell className="text-center">
                    {record.check_out_time ? (
                        <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                            <span className="font-mono text-xs font-semibold text-gray-600 dark:text-gray-400">
                                {formatTime(record.check_out_time)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-gray-300 dark:text-gray-700 text-xs font-mono">-</span>
                    )}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell className="text-right pr-8">
                    {record.status === 'checked-in' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 border border-green-200 dark:border-green-500/30 uppercase tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                            Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700 uppercase tracking-wide">
                            Done
                        </span>
                    )}
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}