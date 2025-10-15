import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TriangleAlert } from 'lucide-react'

export default function Page() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/30 p-4'>
      <Card className='max-w-sm w-full text-center shadow-sm p-6'>
        <CardHeader>
          <CardTitle className='text-xl font-semibold flex items-center justify-center gap-2'>
            <TriangleAlert className='shrink-0' />
            <span className='shrink-0'>Something went wrong</span>
          </CardTitle>
          <p className='text-muted-foreground mt-2'>
            An error occurred while signing up. Please try again or contact
            support.
          </p>
        </CardHeader>

        <Button asChild variant='outline' className='mt-4'>
          <Link href='/'>Back to home</Link>
        </Button>
      </Card>
    </div>
  )
}
