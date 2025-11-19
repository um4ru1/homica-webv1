import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/utils/supabase/server';
import WorkerOnboardingClient from './worker-onboard-client';

export default async function WorkerOnboardingPage({
  searchParams,
}: {
  searchParams: { edit?: string };
}) {
  const supabase = createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: existingWorker } = await supabase
    .from('workers')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  const isEditing = searchParams.edit === 'true';

  if (existingWorker && !isEditing) {
    redirect('/worker/status');
  }

  return (
    <WorkerOnboardingClient 
      userEmail={user.email!} 
      userId={user.id} 
      initialData={existingWorker} 
    /> 
  );
}