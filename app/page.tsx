import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

import ParticipantDashboard from "@/components/ParticipantDashboard"; 
import OrganizerDashboard from "@/components/OrganizerDashboard";

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'organizer') {
    return <OrganizerDashboard profile={profile} />;
  }

  return <ParticipantDashboard profile={profile} />;
}