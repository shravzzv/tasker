'use client'

import { useRef, useState } from 'react'
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
import Link from 'next/link'
import { Spinner } from '@/components/ui/spinner'
import HCaptcha from '@hcaptcha/react-hcaptcha'

const formSchema = z.object({
  email: z.email('Please enter a valid email address'),
})

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | undefined>()

  const captcha = useRef<HCaptcha>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      setErrorMsg(null)
      setSuccessMsg(null)

      const res = await fetch('/forgot-password/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, captchaToken }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.')
      } else {
        setSuccessMsg('Password reset link sent! Please check your email.')
      }
    } catch (err) {
      if (err) setErrorMsg('An unexpected error occurred.')
    } finally {
      setLoading(false)
      if (captcha.current) {
        captcha.current.resetCaptcha()
      }
    }
  }

  return (
    <div className='max-w-md mx-auto mt-10 px-4'>
      <Form {...form}>
        <h1 className='text-2xl font-semibold mb-6 text-center'>
          Forgot your password?
        </h1>

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
                  Enter your registered email to reset your password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {errorMsg && <p className='text-red-500 text-sm'>{errorMsg}</p>}
          {successMsg && <p className='text-green-600 text-sm'>{successMsg}</p>}

          <HCaptcha
            ref={captcha}
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
            onVerify={(token) => {
              setCaptchaToken(token)
            }}
          />

          <Button
            type='submit'
            className='w-full'
            disabled={loading || !captchaToken}
          >
            {loading ? (
              <>
                <Spinner /> Sending link
              </>
            ) : (
              'Reset your password'
            )}
          </Button>

          <p className='text-center text-sm text-muted-foreground'>
            Remembered your password?{' '}
            <Link
              href='/signin'
              className='text-primary underline-offset-4 hover:underline'
            >
              Sign in
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}
