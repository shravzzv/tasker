import { createClient } from '@/utils/supabase/client'

export async function upload(file: File, userId: string) {
  if (!file) return null

  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  const { error } = await supabase.storage
    .from('todos_cover_images')
    .upload(filePath, file)

  if (error) {
    console.error('Upload error:', error)
    throw new Error('Failed to upload image')
  }

  // Get the public URL
  const { data } = supabase.storage
    .from('todos_cover_images')
    .getPublicUrl(filePath)

  return data.publicUrl
}
