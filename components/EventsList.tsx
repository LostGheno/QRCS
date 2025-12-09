'use client'

import { useState } from "react"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Trash2, Edit, Loader2, Clock } from "lucide-react"
import { deleteEvent } from "@/app/actions/events"
import { toast } from "sonner"

type Event = {
  id: string
  title: string
  location: string
  start_time: string
  end_time?: string // <--- Added this field
  created_at: string
}

export default function EventsList({ events }: { events: Event[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const result = await deleteEvent(id)
    
    if (result.success) {
      toast.success("Event deleted successfully")
    } else {
      toast.error(result.error)
    }
    setDeletingId(null)
  }

  // Helper to format date ranges nicely
  const formatEventDate = (start: string, end?: string) => {
    const startDate = new Date(start)
    const dateStr = startDate.toLocaleDateString(undefined, { 
      month: 'short', day: 'numeric', year: 'numeric' 
    })
    const startTimeStr = startDate.toLocaleTimeString(undefined, { 
      hour: 'numeric', minute: '2-digit' 
    })

    if (!end) return `${dateStr} • ${startTimeStr}`

    const endDate = new Date(end)
    const endTimeStr = endDate.toLocaleTimeString(undefined, { 
      hour: 'numeric', minute: '2-digit' 
    })

    // If ends on same day, just show time range
    if (startDate.toDateString() === endDate.toDateString()) {
        return `${dateStr} • ${startTimeStr} - ${endTimeStr}`
    }

    // If multi-day, show full end date
    return `${dateStr} • ${startTimeStr} — ${endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
  }

  return (
    <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden shadow-xl">
      <Table>
        <TableHeader className="bg-gray-50/50 dark:bg-white/5">
          <TableRow className="hover:bg-transparent border-gray-200 dark:border-gray-800">
            <TableHead className="w-[350px] pl-6">Event Details</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-48 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                    <Calendar className="w-10 h-10 mb-2 opacity-20" />
                    <p>No events found. Create one to get started!</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id} className="group hover:bg-purple-50/50 dark:hover:bg-purple-900/10 border-gray-200 dark:border-gray-800 transition-colors">
                
                {/* Event Name & ID */}
                <TableCell className="pl-6 py-4 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                      {event.title.charAt(0)}
                    </div>
                    <div>
                      <span className="block text-gray-900 dark:text-white font-bold text-base">{event.title}</span>
                      <span className="text-xs text-gray-400 font-mono">ID: {event.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Date & Time */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium text-sm">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        {formatEventDate(event.start_time, event.end_time)}
                    </div>
                    {/* Status Badge based on time */}
                    {(() => {
                        const now = new Date()
                        const start = new Date(event.start_time)
                        const end = event.end_time ? new Date(event.end_time) : new Date(start.getTime() + 3600000) // Default 1 hour if null
                        
                        if (now > end) {
                            return <span className="text-[10px] w-fit px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">Completed</span>
                        } else if (now >= start && now <= end) {
                            return <span className="text-[10px] w-fit px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 animate-pulse">● Live Now</span>
                        } else {
                            return <span className="text-[10px] w-fit px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400">Upcoming</span>
                        }
                    })()}
                  </div>
                </TableCell>

                {/* Location */}
                <TableCell>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                    <MapPin className="w-4 h-4 text-cyan-500" />
                    {event.location}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      <Edit className="w-4 h-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          {deletingId === event.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete <strong>{event.title}</strong> and all attendance records.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(event.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}