'use client'

import { signInWithGithub } from '@/app/actions'
import { Button } from './ui/button'

export default function GithubAuthButton() {
  return (
    <form action={signInWithGithub} className='w-full'>
      <Button variant='outline' type='submit' className='w-full'>
        Continue with GitHub
      </Button>
    </form>
  )
}
