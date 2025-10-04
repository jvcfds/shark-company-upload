// src/components/Gallery.tsx (snippet)
import React, { useEffect, useState } from 'react'
import { listPublicFiles, deleteFile } from '../services/UploadService'
import { supabase } from '../supabase'

export const Gallery: React.FC = () => {
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const items = await listPublicFiles('public')
      const objs = items.map((f: any) => {
        const key = `${f.name.startsWith('public/') ? f.name : 'public/' + f.name}` // ajuste se já tiver
        const publicUrl = supabase.storage.from('Uploads').getPublicUrl(key).data.publicUrl
        return { key, publicUrl, name: f.name }
      })
      setFiles(objs)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (key: string) => {
    if (!confirm('Confirmar remoção?')) return
    try {
      await deleteFile(key)
      setFiles(prev => prev.filter(f => f.key !== key))
      alert('Removida com sucesso')
    } catch (err: any) {
      alert('Erro ao remover: ' + (err?.message ?? err))
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {files.map(f => (
        <div key={f.key} className="relative">
          <img src={f.publicUrl} alt={f.name} className="w-full h-48 object-cover rounded" />
          <button onClick={() => handleDelete(f.key)} className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm">
            Remover
          </button>
        </div>
      ))}
    </div>
  )
}
