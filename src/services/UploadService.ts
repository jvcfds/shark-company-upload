// src/services/UploadService.ts  (substitua a função uploadFileToUploads existente)
import { supabase } from '../supabase'

const BUCKET = 'Uploads'

export async function uploadFileToUploads(file: File, folder = 'public') {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData?.session?.user?.id
  if (!userId) throw new Error('Usuário não autenticado')

  const path = `${folder}/${userId}/${Date.now()}-${file.name}`

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
