import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'

export default function Page() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/30 p-4'>
      <Card className='max-w-sm w-full text-center shadow-sm p-6'>
        <CardHeader>
          <CardTitle className='text-xl font-semibold flex items-center justify-center gap-2'>
            <Mail />
            Check your email
          </CardTitle>
          <p className='text-muted-foreground mt-2'>
            We’ve sent a confirmation link to your inbox. Please follow it to
            verify your account.
          </p>
        </CardHeader>
      </Card>
    </div>
  )
}
