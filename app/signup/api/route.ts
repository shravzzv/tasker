import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { email, password, captchaToken } = await req.json()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      captchaToken,
    },
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ data })
}
