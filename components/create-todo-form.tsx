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
})

interface TodoFormProps {
  addTodo: (todo: TodoInterface) => void
  closeDrawer: () => void
}

export default function CreateTodoForm({
  addTodo,
  closeDrawer,
}: TodoFormProps) {
  const [userId, setUserId] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState('10:30:00')
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      due: undefined,
      priority: 'medium',
      status: 'todo',
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!userId) {
      toast.error('User not found')
      return
    }

    // Merge date and time
    const dueDate: Date | undefined = values.due
    if (dueDate) {
      const [hours, minutes, seconds] = time.split(':').map(Number)
      dueDate.setHours(hours, minutes, seconds || 0)
    }

    const todo: TodoInterface = {
      title: values.title,
      description: values.description,
      due: dueDate,
      priority: values.priority,
      status: values.status,
      user_id: userId,
    }

    addTodo(todo)
    toast.success('Todo added successfully')
    form.reset()
    closeDrawer()
  }

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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

        <Button type='submit' className='w-full'>
          Add Todo
        </Button>
      </form>
    </Form>
  )
}
