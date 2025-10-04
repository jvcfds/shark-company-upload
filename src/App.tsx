import React from 'react'
import { FileUpload } from './components/FileUpload'
import { Gallery } from './components/Gallery'

export default function App() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Shark Company — Upload de Arquivos</h1>

      <div className="mb-6">
        <FileUpload onUploaded={() => {
          // Recarrega a galeria após upload — simplest: recarrega a página
          // Melhor: usar um state / callback para acionar reload. Aqui faremos reload completo:
          window.location.reload()
        }} />
      </div>

      <Gallery />
    </div>
  )
}
