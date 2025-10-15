import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/30 p-4'>
      <Card className='max-w-sm w-full text-center shadow-sm p-8'>
        <CardHeader>
          <CardTitle className='text-6xl font-bold'>404</CardTitle>
          <h2 className='text-xl font-semibold mt-2'>Page Not Found</h2>
          <p className='text-muted-foreground mt-1'>
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </CardHeader>

        <Button asChild variant='outline' className='cursor-pointer'>
          <Link href='/'>Return Home</Link>
        </Button>
      </Card>
    </div>
  )
}
