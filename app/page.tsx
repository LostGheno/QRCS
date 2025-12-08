import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
// Import both dashboards
import ParticipantDashboard from "@/components/ParticipantDashboard";
import OrganizerDashboard from "@/components/OrganizerDashboard";

export default async function Home() {
  const supabase = await createClient();

  // 1. Check Login
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 3. Traffic Cop Logic 🚦
  if (profile?.role === 'organizer') {
    return <OrganizerDashboard profile={profile} />;
  }

  // Default to Participant view
  return <ParticipantDashboard profile={profile} />;
}