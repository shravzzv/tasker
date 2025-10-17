'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL_ROOT}/auth/callback`,
    },
  })

  if (error) {
    console.error('Google Sign-In Error:', error.message)
    redirect('/error')
  }

  // Supabase returns a URL that the user must be redirected to
  redirect(data.url)
}

export async function signInWithGithub() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL_ROOT}/auth/callback`,
    },
  })

  if (error) {
    console.error('GitHub Sign-In Error:', error.message)
    redirect('/error')
  }

  redirect(data.url)
}
