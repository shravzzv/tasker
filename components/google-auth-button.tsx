'use client'

import { signInWithGoogle } from '@/app/actions'
import { Button } from './ui/button'

export default function GoogleAuthButton() {
  return (
    <form action={signInWithGoogle} className='w-full'>
      <Button variant='outline' type='submit' className='w-full'>
        Continue with Google
      </Button>
    </form>
  )
}
