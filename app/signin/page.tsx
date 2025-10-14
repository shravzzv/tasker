'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'
import GoogleAuthButton from '@/components/google-auth-button'
import GithubAuthButton from '@/components/github-auth-button'

const formSchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export default function SignInPage() {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      setErrorMsg(null)

      const res = await fetch('/signin/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Invalid credentials')
      } else {
        router.replace('/dashboard')
      }
    } catch {
      setErrorMsg('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-md mx-auto mt-10'>
      <h1 className='text-2xl font-semibold mb-6 text-center'>Welcome Back</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='you@example.com'
                    type='email'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the email associated with your account.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center justify-between'>
                  <FormLabel>Password</FormLabel>
                  <Link
                    href='/forgot-password'
                    className='text-sm text-primary underline-offset-4 hover:underline'
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    placeholder='••••••••'
                    type='password'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Your password must be at least 8 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {errorMsg && <p className='text-red-500 text-sm'>{errorMsg}</p>}

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? (
              <>
                <Spinner />
                Signing in
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </Form>

      {/* Divider */}
      <div className='relative my-8'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-muted-foreground/30'></span>
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>
            or continue with
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <GoogleAuthButton />
        <GithubAuthButton />
      </div>

      <p className='text-center text-sm text-muted-foreground mt-6'>
        Don&apos;t have an account?{' '}
        <Link
          href='/signup'
          className='text-primary underline-offset-4 hover:underline'
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
