import React, { useEffect, useState } from 'react'
import { listPublicFiles } from '../services/UploadService'
import { supabase } from '../supabase'

export const Gallery: React.FC = () => {
  const [urls, setUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true); setError(null)
    try {
      const files = await listPublicFiles('public')
      const publicUrls = files.map((f: any) => supabase.storage.from('Uploads').getPublicUrl(`public/${f.name}`).data.publicUrl)
      setUrls(publicUrls)
    } catch (e: any) {
      setError(e?.message || 'Erro ao listar arquivos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <p>Carregando...</p>
  if (error) return <p className="text-red-500">Erro: {error}</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {urls.length === 0 && <p className="text-gray-400">Nenhum arquivo encontrado.</p>}
      {urls.map(u => (
        <div key={u} className="rounded overflow-hidden shadow">
          <img src={u} alt="upload" className="w-full h-48 object-cover" />
        </div>
      ))}
    </div>
  )
}
