import { createClient } from './supabase/client'

export async function deleteUploadedImage(publicUrl: string): Promise<void> {
  try {
    const supabase = createClient()
    const bucket = 'todos_cover_images'
    const filePath = publicUrl.split(`/${bucket}/`)[1]
    const { error } = await supabase.storage.from(bucket).remove([filePath])

    if (error) {
      console.error('Delete error:', error)
    }
  } catch (err) {
    console.error('Error deleting image:', err)
  }
}
