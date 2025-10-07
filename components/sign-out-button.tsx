'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = await createClient()
    await supabase.auth.signOut()
    router.replace('/signin')
  }

  return <Button onClick={handleSignOut}>Sign Out</Button>
}
