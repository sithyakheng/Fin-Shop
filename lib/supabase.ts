import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

export const uploadImage = async (file: File, bucket: string = 'products'): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw error
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return publicUrl
}

export const deleteImage = async (url: string, bucket: string = 'products'): Promise<void> => {
  const urlParts = url.split('/')
  const fileName = urlParts[urlParts.length - 1]

  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName])

  if (error) {
    throw error
  }
}

export default supabase
