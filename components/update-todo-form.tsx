'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { TodoInterface } from '@/types/todo'
import { createClient } from '@/utils/supabase/client'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { upload } from '@/utils/upload'
import { Spinner } from './ui/spinner'
import Image from 'next/image'
import { deleteUploadedImage } from '@/utils/delete-upload'

const formSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 3, {
      message: 'Description must be at least 3 characters long',
    }),
  due: z.date().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'in-progress', 'done']),
  cover_image: z
    .any()
    .optional()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith('image/')),
      'File must be an image'
    ),
})

interface UpdateTodoFormProps {
  todo: TodoInterface
  updateTodo: (updatedTodo: Partial<TodoInterface>) => void
  closeDrawer: () => void
}

export default function UpdateTodoForm({
  todo,
  updateTodo,
  closeDrawer,
}: UpdateTodoFormProps) {
  const [userId, setUserId] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState('10:30:00')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description || '',
      due: todo.due ? new Date(todo.due) : undefined,
      priority: todo.priority || 'medium',
      status: todo.status || 'todo',
      cover_image: '',
    },
  })

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        toast.error('User not found')
        return
      }
      setUserId(data.user.id)
    }
    fetchUser()
  }, [supabase])

  useEffect(() => {
    if (todo.due) {
      const dueDate = new Date(todo.due)
      const hours = dueDate.getHours().toString().padStart(2, '0')
      const minutes = dueDate.getMinutes().toString().padStart(2, '0')
      const seconds = dueDate.getSeconds().toString().padStart(2, '0')
      setTime(`${hours}:${minutes}:${seconds}`)
    }
  }, [todo.due])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    if (!userId) {
      toast.error('User not found')
      setLoading(false)
      return
    }

    let coverImageUrl = todo.cover_image || null

    if (values.cover_image && values.cover_image instanceof File) {
      try {
        coverImageUrl = await upload(values.cover_image, userId)
        if (todo.cover_image) await deleteUploadedImage(todo.cover_image)
      } catch (error) {
        toast.error('Failed to upload new image')
        console.error(error)
      }
    }

    // Merge date + time
    const dueDate: Date | undefined = values.due
    if (dueDate) {
      const [hours, minutes, seconds] = time.split(':').map(Number)
      dueDate.setHours(hours, minutes, seconds || 0)
    }

    const updatedTodo: TodoInterface = {
      ...todo,
      title: values.title,
      description: values.description,
      due: dueDate,
      priority: values.priority,
      status: values.status,
      user_id: userId,
      cover_image: coverImageUrl || '',
    }

    try {
      const { error } = await supabase
        .from('todos')
        .update(updatedTodo)
        .eq('id', todo.id)

      if (error) throw error

      updateTodo(updatedTodo)
      toast.success('Todo updated successfully!')
      form.reset()
      closeDrawer()
    } catch (err) {
      console.error('Error updating todo:', err)
      toast.error('Failed to update todo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title*</FormLabel>
              <FormControl>
                <Input placeholder='Todo title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder='Optional description' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='due'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel>Due</FormLabel>
              <div className='flex gap-4 flex-wrap'>
                {/* Date Picker */}
                <div className='flex flex-col gap-2'>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-[160px] justify-between font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                        id='date-picker'
                      >
                        {field.value
                          ? format(field.value, 'PPP')
                          : 'Select date'}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-auto overflow-hidden p-0'
                      align='start'
                    >
                      <Calendar
                        mode='single'
                        captionLayout='dropdown'
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date)
                          setOpen(false)
                        }}
                        disabled={(date) => {
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return date < today
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Picker */}
                <div className='flex flex-col gap-2'>
                  <Input
                    type='time'
                    id='time-picker'
                    step='1'
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className='bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                  />
                </div>
              </div>
              <FormDescription>
                Pick a valid date and time for your todo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='priority'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className='flex gap-4 flex-wrap'
                >
                  {['low', 'medium', 'high'].map((level) => (
                    <div key={level} className='flex items-center gap-2'>
                      <RadioGroupItem value={level} id={level} />
                      <label htmlFor={level}>
                        {level[0].toUpperCase() + level.slice(1)}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className='flex gap-4 flex-wrap'
                >
                  {['todo', 'in-progress', 'done'].map((s) => (
                    <div key={s} className='flex items-center gap-2'>
                      <RadioGroupItem value={s} id={s} />
                      <label htmlFor={s}>{s.replace('-', ' ')}</label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='cover_image'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              {todo.cover_image ? (
                <>
                  <span className='text-sm text-muted-foreground'>
                    Current image will be replaced if you upload a new one.
                  </span>
                  <div className='relative w-full h-16 mt-1'>
                    <Image
                      src={todo.cover_image}
                      alt='Current cover'
                      fill
                      className='object-cover rounded-md border'
                      sizes='100vw'
                    />
                  </div>
                </>
              ) : (
                <span className='text-sm text-muted-foreground'>
                  No cover image uploaded. Upload an optional cover image for
                  your todo. Use a landscape image for best results.
                </span>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full cursor-pointer'
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner />
              Updating todo
            </>
          ) : (
            'Update Todo'
          )}
        </Button>
      </form>
    </Form>
  )
}
