'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'

export async function deleteEvent(eventId: string) {
  const supabase = await createClient()
  
  // Get current user to ensure security
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Delete the event (RLS policies will ensure they can only delete their own)
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)
    .eq('organizer_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/events')
  revalidatePath('/') // Refresh dashboard stats too
  return { success: true }
}