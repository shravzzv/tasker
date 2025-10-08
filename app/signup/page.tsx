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

const formSchema = z
  .object({
    email: z.email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Confirm password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export default function SignUpPage() {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      setErrorMsg(null)

      const res = await fetch('/signup/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong')
      } else {
        router.replace('/confirm-email')
      }
    } catch {
      setErrorMsg('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-md mx-auto mt-10'>
      <h1 className='text-2xl font-semibold mb-6 text-center'>
        Create an Account
      </h1>

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
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  We&apos;ll never share your email with anyone else.
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder='••••••••' type='password' {...field} />
                </FormControl>
                <FormDescription>
                  Must be at least 8 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder='••••••••' type='password' {...field} />
                </FormControl>
                <FormDescription>
                  Must match the password entered above.
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
                Signing up
              </>
            ) : (
              'Sign Up'
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

      {/* Google Button */}
      <GoogleAuthButton />

      <p className='text-center text-sm text-muted-foreground mt-6'>
        Already have an account?{' '}
        <Link
          href='/signin'
          className='text-primary underline-offset-4 hover:underline'
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
