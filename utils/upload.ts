import { createClient } from '@/utils/supabase/client'
import { v4 as uuidv4 } from 'uuid'

export async function upload(
  file: File,
  userId: string
): Promise<string | null> {
  if (!file) return null

  const supabase = createClient()
  const filePath = `${userId}/${uuidv4()}`

  const { error } = await supabase.storage
    .from('todos_cover_images')
    .upload(filePath, file)

  if (error) {
    console.error('Upload error:', error)
  }

  // Get the public URL
  const { data } = supabase.storage
    .from('todos_cover_images')
    .getPublicUrl(filePath)

  return data.publicUrl
}
