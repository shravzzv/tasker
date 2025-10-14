'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import defaultTodoCoverImage from '@/public/default todo cover image.jpg'
import { TodoInterface } from '@/types/todo'
import { format } from 'date-fns'
import { Clock, Flag, ListChecks, Pencil, Trash } from 'lucide-react'
import { Button } from './ui/button'
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ScrollArea } from './ui/scroll-area'
import { useState } from 'react'
import UpdateTodoForm from './update-todo-form'
import Link from 'next/link'

interface TodoProps {
  todo: TodoInterface
  deleteTodo: (id: string) => void
  updateTodo: (id: string, updatedFields: Partial<TodoInterface>) => void
}

export default function Todo({ todo, deleteTodo, updateTodo }: TodoProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

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

  const handleDelete = async () => {
    if (!todo.id) return

    try {
      await deleteTodo(todo.id)
      toast.success('Todo deleted successfully.')
    } catch (error) {
      toast.error('Failed to delete todo.')
      console.error(error)
    }
  }

  return (
    <Card className='overflow-hidden rounded-2xl shadow-md transition-all hover:shadow-lg pt-0'>
      <div className='relative w-full h-40'>
        <Image
          src={todo.cover_image || defaultTodoCoverImage}
          alt='cover image'
          fill
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          className='object-cover'
        />
      </div>

      <CardHeader>
        <CardTitle className='text-xl font-semibold truncate'>
          {todo.title}
        </CardTitle>

        {todo.description && (
          <CardDescription className='text-sm text-muted-foreground truncate'>
            {todo.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className='space-y-3'>
        {todo.due && (
          <div className='flex items-center gap-2 text-sm'>
            <Clock size={16} />
            <span>{format(new Date(todo.due), 'PPp')}</span>
          </div>
        )}

        <div className='flex items-center gap-2 text-sm'>
          <Flag size={16} />
          <Badge className={priorityColors[todo.priority || 'medium']}>
            {todo.priority}
          </Badge>
        </div>

        <div className='flex items-center gap-2 text-sm'>
          <ListChecks size={16} />
          <Badge className={statusColors[todo.status || 'todo']}>
            {todo.status}
          </Badge>
        </div>
      </CardContent>

      <CardFooter>
        <div className='flex gap-2'>
          <Drawer
            direction='right'
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
          >
            <DrawerTrigger asChild>
              <Button
                variant={'secondary'}
                size={'sm'}
                className='cursor-pointer'
              >
                <Pencil size={16} />
                Edit
              </Button>
            </DrawerTrigger>
            <DrawerContent className='max-h-screen overflow-y-auto'>
              <DrawerHeader>
                <DrawerTitle>Update a todo</DrawerTitle>
                <DrawerDescription>
                  Edit the details below to update a todo in your list.
                </DrawerDescription>
              </DrawerHeader>
              <ScrollArea>
                <UpdateTodoForm
                  todo={todo}
                  updateTodo={(updatedFields) => {
                    if (todo.id) {
                      updateTodo(todo.id, updatedFields)
                    }
                  }}
                  closeDrawer={() => setIsDrawerOpen(false)}
                />
              </ScrollArea>
            </DrawerContent>
          </Drawer>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant={'destructive'}
                size={'sm'}
                className='cursor-pointer'
              >
                <Trash size={16} />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this todo?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. It will permanently delete this
                  todo from your list.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className='cursor-pointer'>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className='cursor-pointer bg-destructive text-white hover:bg-destructive/90'
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button variant='link' size='sm' className='cursor-pointer' asChild>
            <Link href={`/todo/${todo.id}`}>More</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
