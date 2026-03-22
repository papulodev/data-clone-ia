'use client'
import { useState } from 'react'
import { Clone, chatear } from '@/app/lib/api'
interface Props {
  clon: Clone
}
interface Mensaje {
  rol: 'user' | 'ia'
  texto: string
}
export default function ChatWindow({ clon }: Props) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      rol: 'ia',
      texto: `Hola, soy ${clon.nombre}. ¿En qué querés preguntarme sobre mis preferencias como cliente?`
    }
  ])
  const [input, setInput] = useState('')
  const [cargando, setCargando] = useState(false)
  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || cargando) return
    const mensajeUser = input
    setInput('')
    setMensajes((prev) => [...prev, { rol: 'user', texto: mensajeUser }])
    setCargando(true)
    try {
      const res = await chatear(clon._id, mensajeUser)
      if (res.ok) {
        setMensajes((prev) => [...prev, { rol: 'ia', texto: res.respuesta }])
      }
    } catch (error) {
      setMensajes((prev) => [...prev, { rol: 'ia', texto: 'Ups, hubo un error. Intentá de nuevo.' }])
    }
    setCargando(false)
  }
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold">Chat con {clon.nombre}</h2>
        <p className="text-sm text-gray-500">{clon.resumenPersonalidad.substring(0, 100)}...</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensajes.map((msg, i) => (
          <div key={i} className={`flex ${msg.rol === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${msg.rol === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800'
                }`}
            >
              {msg.texto}
            </div>
          </div>
        ))}
        {cargando && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <span className="animate-pulse">Escribiendo...</span>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={enviarMensaje} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribí tu pregunta..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={cargando}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  )
}