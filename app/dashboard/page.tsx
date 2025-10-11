'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import SignOutButton from '@/components/sign-out-button'
import { TodoInterface } from '@/types/todo'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import CreateTodoForm from '@/components/create-todo-form'
import Image from 'next/image'
import defaultTodoCoverImage from '@/public/default todo cover image.jpg'

export default function Dashboard() {
  const [todos, setTodos] = useState<TodoInterface[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const supabase = createClient()

  const createTodo = async (todo: TodoInterface) => {
    const { data, error } = await supabase.from('todos').insert(todo).select()
    if (error) console.error('Error creating todo:', error)
    if (data && data.length > 0) {
      setTodos((prev) => [data[0], ...prev])
    }
  }

  useEffect(() => {
    const fetchTodos = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data?.user) return

      const { data: todosData } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', data.user.id)

      setTodos(todosData || [])
    }

    fetchTodos()
  }, [supabase])

  return (
    <div>
      <SignOutButton />

      <h1>My Todos</h1>

      {todos.map((todo) => (
        <div key={todo.id}>
          <Image
            src={todo.cover_image || defaultTodoCoverImage}
            alt='cover image'
            width={100}
            height={50}
            className='h-auto w-auto object-cover rounded'
          />
          <h2>{todo.title}</h2>
          <p>{todo.description}</p>
          <p>
            Due:{' '}
            {todo.due ? new Date(todo.due).toLocaleTimeString() : 'No due date'}
          </p>
        </div>
      ))}

      {todos.length === 0 && <p>No todos found.</p>}

      <Drawer
        direction='right'
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      >
        <DrawerTrigger asChild>
          <Button>
            <Plus />
            Add Todo
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create a new Todo</DrawerTitle>
            <DrawerDescription>
              Fill out the details below to add a new todo to your list.
            </DrawerDescription>
          </DrawerHeader>
          <CreateTodoForm
            addTodo={createTodo}
            closeDrawer={() => setIsDrawerOpen(false)}
          />
        </DrawerContent>
      </Drawer>
    </div>
  )
}
