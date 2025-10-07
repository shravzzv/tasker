import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import SignOutButton from '@/components/sign-out-button'

export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/signin')
  }

  return (
    <div>
      <p>Hello {data.user.email}</p>
      <SignOutButton />
    </div>
  )
}
