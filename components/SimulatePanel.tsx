'use client'
import { useState } from 'react'
import { Clone, simular } from '@/app/lib/api'
interface Props {
  clon: Clone
}
export default function SimulatePanel({ clon }: Props) {
  const [escenario, setEscenario] = useState('')
  const [resultado, setResultado] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)
  const handleSimular = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!escenario.trim() || cargando) return
    setCargando(true)
    setResultado(null)
    try {
      const res = await simular(clon._id, escenario)
      if (res.ok) {
        setResultado(res.resultado)
      }
    } catch (error) {
      setResultado('Error al simular. Intentá de nuevo.')
    }
    setCargando(false)
  }
  const sugerencias = [
    'suben el precio un 20%',
    'lanzan una promoción del 30% off',
    'agregan un nuevo producto de $15000',
    'eliminan el envío gratis'
  ]
  return (
    <div className="p-4">
      <h3 className="font-semibold mb-3">Simulador de Escenarios</h3>
      <p className="text-sm text-gray-500 mb-4">
        Probá cómo reaccionaría {clon.nombre} ante diferentes escenarios.
      </p>
      <form onSubmit={handleSimular} className="space-y-3">
        <textarea
          value={escenario}
          onChange={(e) => setEscenario(e.target.value)}
          placeholder="Ej: suben el precio un 20%"
          rows={2}
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 resize-none"
        />
        <button
          type="submit"
          disabled={cargando}
          className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
        >
          {cargando ? 'Simulando...' : 'Simular'}
        </button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {sugerencias.map((s) => (
          <button
            key={s}
            onClick={() => setEscenario(s)}
            className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {s}
          </button>
        ))}
      </div>
      {resultado && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium mb-2">Resultado:</h4>
          <p className="whitespace-pre-wrap text-sm">{resultado}</p>
        </div>
      )}
    </div>
  )
}