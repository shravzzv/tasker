'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession()
      if (!mounted) return
      if (error) console.error('Error checking session:', error)

      if (data?.session?.user) {
        setUser(data.session.user)
        setLoading(false)
      } else {
        // Not authenticated — redirect to sign in
        router.replace('/signin')
      }
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return
        if (session?.user) {
          setUser(session.user)
          setLoading(false)
        } else {
          router.replace('/signin')
        }
      }
    )

    return () => {
      mounted = false
      // cleanup listener
      listener?.subscription.unsubscribe()
    }
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace('/signin')
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spinner />
      </div>
    )
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  )
}
