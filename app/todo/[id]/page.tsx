'use client'

import { TodoInterface } from '@/types/todo'
import { createClient } from '@/utils/supabase/client'
import { use, useEffect, useState } from 'react'
import Image from 'next/image'
import defaultTodoCoverImage from '@/public/default todo cover image.jpg'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import UpdateTodoForm from '@/components/update-todo-form'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Clock, AlertTriangle, ListTodo } from 'lucide-react'
import Link from 'next/link'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [todo, setTodo] = useState<TodoInterface | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    setError(null)
    const fetchTodo = async () => {
      try {
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .eq('id', id)
          .single()
        if (error) setError(error.message)
        else setTodo(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchTodo()
  }, [id, supabase])

  const deleteTodo = async () => {
    if (!todo?.id) return
    const { error } = await supabase.from('todos').delete().eq('id', todo.id)
    if (error) {
      toast.error('Failed to delete todo.')
    } else {
      toast.success('Todo deleted successfully.')
    }
    router.replace('/dashboard')
  }

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  }

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    done: 'bg-emerald-100 text-emerald-800',
  }

  if (loading) {
    return (
      <div className='flex flex-col min-h-screen'>
        <Skeleton className='w-full h-40 md:h-64' />

        <main className='flex-1 max-w-3xl mx-auto w-full px-6 py-8 space-y-6'>
          <Skeleton className='h-8 w-3/4' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
          <Skeleton className='h-4 w-2/3' />

          <div className='grid gap-3 mt-6'>
            <Skeleton className='h-4 w-1/3' />
            <Skeleton className='h-4 w-1/4' />
            <Skeleton className='h-4 w-1/5' />
          </div>

          <div className='flex gap-3 mt-6'>
            <Skeleton className='h-9 w-20 rounded-md' />
            <Skeleton className='h-9 w-20 rounded-md' />
          </div>
        </main>
      </div>
    )
  }

  if (!todo) return <div className='p-6 text-center'>Todo not found.</div>

  if (error)
    return <div className='p-6 text-center text-red-500'>Error: {error}</div>

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='relative w-full h-40 md:h-64'>
        <Image
          src={todo.cover_image || defaultTodoCoverImage}
          alt='Todo cover'
          fill
          className='object-cover'
          sizes='100vw'
          priority
        />
      </div>

      <main className='flex-1 max-w-3xl mx-auto w-full px-6 py-8 space-y-6'>
        <h1 className='text-3xl font-bold'>{todo.title}</h1>

        <div className='mt-6 text-sm space-y-3'>
          <div className='grid grid-cols-[150px_1fr] gap-4'>
            {todo.due && (
              <>
                <div className='flex items-center gap-1 text-muted-foreground'>
                  <Calendar className='w-4 h-4' />
                  <span className='text-gray-500'>Due</span>
                </div>
                <div className='text-foreground'>
                  {format(new Date(todo.due), 'MMMM d, yyyy h:mm a')}
                </div>
              </>
            )}

            <div className='flex items-center gap-1 text-muted-foreground'>
              <AlertTriangle className='w-4 h-4' />
              <span className='text-gray-500'>Priority</span>
            </div>
            <div>
              <Badge
                className={
                  priorityColors[todo.priority || 'medium'] +
                  ' capitalize font-normal'
                }
              >
                {todo.priority}
              </Badge>
            </div>

            <div className='flex items-center gap-1 text-muted-foreground'>
              <ListTodo className='w-4 h-4' />
              <span className='text-gray-500'>Status</span>
            </div>
            <div>
              <Badge
                className={
                  statusColors[todo.status || 'todo'] +
                  ' capitalize font-normal'
                }
              >
                {todo.status}
              </Badge>
            </div>

            {todo.created_at && (
              <>
                <div className='flex items-center gap-1 text-muted-foreground'>
                  <Clock className='w-4 h-4' />
                  <span className='text-gray-500'>Created time</span>
                </div>
                <div className='text-foreground'>
                  {format(new Date(todo.created_at), 'MMMM d, yyyy h:mm a')}
                </div>
              </>
            )}
          </div>
        </div>

        {todo.description && (
          <p className='text-muted-foreground leading-relaxed'>
            {todo.description}
          </p>
        )}

        <div className='flex gap-3 mt-6'>
          <Drawer
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            direction='right'
          >
            <DrawerTrigger asChild>
              <Button variant='secondary' className='cursor-pointer'>
                Edit
              </Button>
            </DrawerTrigger>
            <DrawerContent className='max-h-screen overflow-y-auto'>
              <DrawerHeader>
                <DrawerTitle>Update Todo</DrawerTitle>
                <DrawerDescription>
                  Edit the details below to update this todo.
                </DrawerDescription>
              </DrawerHeader>
              <ScrollArea>
                <UpdateTodoForm
                  todo={todo}
                  updateTodo={(updatedFields) => {
                    if (todo.id) {
                      setTodo({ ...todo, ...updatedFields })
                    }
                  }}
                  closeDrawer={() => setIsDrawerOpen(false)}
                />
              </ScrollArea>
            </DrawerContent>
          </Drawer>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' className='cursor-pointer'>
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this todo?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. It will permanently remove this
                  todo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className='cursor-pointer'>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteTodo}
                  className='cursor-pointer bg-destructive text-white hover:bg-destructive/90'
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button variant='link' size='sm' className='cursor-pointer' asChild>
            <Link href='/dashboard'>Back</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
