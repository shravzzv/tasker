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
import { createClient } from '@/utils/supabase/client'

const formSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '' },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      setErrorMsg(null)

      const { data, error } = await supabase.auth.updateUser({
        password: values.password,
      })

      if (error || !data.user) {
        setErrorMsg(error?.message || 'Something went wrong')
      } else {
        router.replace('/signin')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-md mx-auto mt-10'>
      <Form {...form}>
        <h1 className='text-2xl font-semibold mb-6 text-center'>
          Update Password
        </h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder='••••••••'
                    type='password'
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Must be at least 8 characters.
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
                Updating password
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
