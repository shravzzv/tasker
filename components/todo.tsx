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
import { Clock, Flag, ListChecks } from 'lucide-react'

interface TodoProps {
  todo: TodoInterface
}

export default function Todo({ todo }: TodoProps) {
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

      <CardFooter className='text-xs text-muted-foreground'>
        Created:{' '}
        {todo.created_at ? format(new Date(todo.created_at), 'PPpp') : '—'}
      </CardFooter>
    </Card>
  )
}
