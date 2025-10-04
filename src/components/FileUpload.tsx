import React, { useCallback, useState } from 'react'
import { uploadFileToUploads } from '../services/uploadService'

type Props = {
  onUploaded?: (publicUrl?: string) => void
  maxSizeMB?: number
  allowedTypes?: string[]
}

export const FileUpload: React.FC<Props> = ({
  onUploaded,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validate = (file: File) => {
    if (!allowedTypes.includes(file.type)) return `Tipo inválido. Permitido: ${allowedTypes.join(', ')}`
    if (file.size > maxSizeMB * 1024 * 1024) return `Arquivo muito grande. Máx ${maxSizeMB}MB`
    return null
  }

  const handleFiles = useCallback(async (files: FileList | null) => {
    setError(null)
    if (!files || files.length === 0) return
    const file = files[0]
    const v = validate(file)
    if (v) {
      setError(v)
      return
    }

    // preview
    const reader = new FileReader()
    reader.onload = () => setPreview(String(reader.result))
    reader.readAsDataURL(file)

    setLoading(true)
    try {
      const res = await uploadFileToUploads(file, 'public')
      onUploaded?.(res.publicUrl)
    } catch (e: any) {
      setError(e?.message || 'Erro no upload')
    } finally {
      setLoading(false)
    }
  }, [onUploaded, maxSizeMB, allowedTypes])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    e.currentTarget.value = ''
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border-dashed border-2 rounded p-6 text-center ${dragOver ? 'border-green-300' : 'border-gray-400'}`}
      >
        <input id="file-input" type="file" accept={allowedTypes.join(',')} onChange={onFileChange} className="hidden" />
        <label htmlFor="file-input" className="cursor-pointer">
          <div className="font-semibold">Arraste arquivos aqui ou clique para selecionar</div>
          <div className="text-sm text-gray-400 mt-2">{allowedTypes.join(', ')} • Máx {maxSizeMB}MB</div>
        </label>
      </div>

      {loading && <p className="mt-2 text-sm text-yellow-400">Enviando...</p>}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-300">Preview</p>
          <img src={preview} alt="preview" className="mt-2 max-w-xs rounded" />
        </div>
      )}
    </div>
  )
}
