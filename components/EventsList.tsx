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
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Trash2, Edit, MoreHorizontal, Loader2 } from "lucide-react"
import { deleteEvent } from "@/app/actions/events"
import { toast } from "sonner"

type Event = {
  id: string
  title: string
  location: string
  start_time: string
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

  return (
    <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden shadow-xl">
      <Table>
        <TableHeader className="bg-gray-50/50 dark:bg-white/5">
          <TableRow className="hover:bg-transparent border-gray-200 dark:border-gray-800">
            <TableHead className="w-[300px]">Event Details</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                No events found. Create one to get started!
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id} className="group hover:bg-purple-50/50 dark:hover:bg-purple-900/10 border-gray-200 dark:border-gray-800 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {event.title.charAt(0)}
                    </div>
                    <div>
                      <span className="block text-gray-900 dark:text-white font-bold">{event.title}</span>
                      <span className="text-xs text-gray-500">ID: {event.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    {new Date(event.start_time).toLocaleDateString()}
                    <span className="text-xs text-gray-400">
                      {new Date(event.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 text-cyan-500" />
                    {event.location}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* EDIT BUTTON (Placeholder for now) */}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Edit className="w-4 h-4" />
                    </Button>

                    {/* DELETE ALERT DIALOG */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          {deletingId === event.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete <strong>{event.title}</strong> and all associated attendance records. This action cannot be undone.
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