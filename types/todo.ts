export interface TodoInterface {
  id?: string
  created_at?: Date
  // fields above are automatically managed by supabase

  user_id: string
  title: string
  description?: string
  due?: Date
  cover_image?: string
  priority?: 'low' | 'medium' | 'high'
  status?: 'todo' | 'in-progress' | 'done'
}
