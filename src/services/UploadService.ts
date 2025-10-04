import { supabase } from '../supabase'

const BUCKET = 'Uploads'

export async function uploadFileToUploads(file: File, folder = 'public') {
  const path = `${folder}/${Date.now()}-${file.name}`

  console.log('[upload] bucket=', BUCKET, 'path=', path)

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) {
    console.error('[uploadFileToUploads] error', error)
    throw error
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { key: data?.Key ?? path, publicUrl: urlData?.publicUrl }
}

export async function listPublicFiles(prefix = 'public') {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix)
  if (error) {
    console.error('[listPublicFiles] error', error)
    throw error
  }
  return data || []
}
