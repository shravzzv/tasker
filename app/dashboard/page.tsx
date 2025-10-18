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
import Todo from '@/components/todo'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { deleteUploadedImage } from '@/utils/delete-upload'

export default function Dashboard() {
  const [todos, setTodos] = useState<TodoInterface[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [loadingTodos, setLoadingTodos] = useState(true)
  const supabase = createClient()

  const createTodo = async (todo: TodoInterface) => {
    const { data, error } = await supabase.from('todos').insert(todo).select()
    if (error) console.error('Error creating todo:', error)
    if (data && data.length > 0) {
      setTodos((prev) => [data[0], ...prev])
    }
  }

  const deleteTodo = async (id: string) => {
    const { data } = await supabase
      .from('todos')
      .select('cover_image')
      .eq('id', id)
      .single()

    const { error } = await supabase.from('todos').delete().eq('id', id)
    if (error) console.error('Error deleting todo:', error)

    // delete cover image if present from storage
    if (data?.cover_image) await deleteUploadedImage(data.cover_image)

    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const updateTodo = async (
    id: string,
    updatedFields: Partial<TodoInterface>
  ) => {
    const { data, error } = await supabase
      .from('todos')
      .update(updatedFields)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating todo:', error)
    }

    if (data && data.length > 0) {
      setTodos((prev) => prev.map((todo) => (todo.id === id ? data[0] : todo)))
    }
  }

  useEffect(() => {
    const fetchTodos = async () => {
      setLoadingTodos(true)
      const { data } = await supabase.auth.getUser()
      if (!data?.user) {
        setLoadingTodos(false)
        return
      }

      const { data: todosData } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', data.user.id)

      setTodos(todosData || [])
      setLoadingTodos(false)
    }

    fetchTodos()
  }, [supabase])

  useEffect(() => {
    const userFetchAndSubscribe = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data?.user) return

      const userId = data.user.id

      // Subscribe to changes for this user's todos
      const channel = supabase
        .channel('public:todos') // channel name can be anything
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'todos',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const { eventType, new: newTodoRaw, old: oldTodoRaw } = payload
            const newTodo = newTodoRaw as TodoInterface
            const oldTodo = oldTodoRaw as TodoInterface

            setTodos((prev) => {
              switch (eventType) {
                case 'INSERT':
                  if (!prev.find((t) => t.id === newTodo.id)) {
                    return [newTodo, ...prev]
                  }
                  return prev
                case 'UPDATE':
                  return prev.map((t) => (t.id === newTodo.id ? newTodo : t))
                case 'DELETE':
                  return prev.filter((t) => t.id !== oldTodo.id)
                default:
                  return prev
              }
            })
          }
        )
        .subscribe()

      // Cleanup: unsubscribe when component unmounts
      return () => {
        supabase.removeChannel(channel)
      }
    }

    const cleanupPromise = userFetchAndSubscribe()
    return () => {
      cleanupPromise.then((cleanup) => cleanup && cleanup())
    }
  }, [supabase])

  return (
    <div>
      <div className='flex justify-end p-6'>
        <SignOutButton />
      </div>

      <div className='flex flex-wrap justify-between px-6'>
        <h1 className='text-2xl font-bold mb-4'>My Todos</h1>

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
          <DrawerContent className='max-h-screen overflow-y-auto'>
            <DrawerHeader>
              <DrawerTitle>Create a new Todo</DrawerTitle>
              <DrawerDescription>
                Fill out the details below to add a new todo to your list.
              </DrawerDescription>
            </DrawerHeader>
            <ScrollArea>
              <CreateTodoForm
                addTodo={createTodo}
                closeDrawer={() => setIsDrawerOpen(false)}
              />
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      </div>

      <div className='grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 p-6'>
        {loadingTodos
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className='overflow-hidden rounded-2xl shadow-md p-4 flex flex-col gap-3'
              >
                <Skeleton className='h-40 w-full rounded-md' />
                <Skeleton className='h-6 w-3/4 rounded-md' />
                <Skeleton className='h-4 w-1/2 rounded-md' />
                <div className='flex gap-2'>
                  <Skeleton className='h-6 w-16 rounded-full' />
                  <Skeleton className='h-6 w-16 rounded-full' />
                </div>
              </div>
            ))
          : todos.map((todo) => (
              <Todo
                key={todo.id}
                todo={todo}
                deleteTodo={deleteTodo}
                updateTodo={updateTodo}
              />
            ))}
      </div>

      {!loadingTodos && todos.length === 0 && (
        <p className='text-muted-foreground px-6'>No todos found.</p>
      )}
    </div>
  )
}
