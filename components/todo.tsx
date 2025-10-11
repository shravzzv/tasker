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

interface TodoProps {
  todo: TodoInterface
  deleteTodo: (id: string) => void
}

export default function Todo({ todo, deleteTodo }: TodoProps) {
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

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this todo?')) {
      if (todo.id) {
        deleteTodo(todo.id)
      } else {
        alert('Cannot delete: todo id is missing.')
      }
    }

    toast.success('Todo deleted successfully.')
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
        <CardTitle className='text-xl font-semibold'>{todo.title}</CardTitle>

        {todo.description && (
          <CardDescription className='text-sm text-muted-foreground'>
            {todo.description.length > 80
              ? `${todo.description.slice(0, 80)}...`
              : todo.description}
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
          <Button variant={'secondary'} size={'sm'} className='cursor-pointer'>
            <Pencil size={16} />
            Edit
          </Button>

          <Button
            variant={'destructive'}
            size={'sm'}
            className='cursor-pointer'
            onClick={handleDelete}
          >
            <Trash size={16} />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
