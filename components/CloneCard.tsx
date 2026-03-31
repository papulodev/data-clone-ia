'use client'
import { Clone } from '@/lib/api'
interface Props {
  clon: Clone
  onSelect: (clon: Clone) => void
  selected: boolean
}
export default function CloneCard({ clon, onSelect, selected }: Props) {
  return (
    <div
      onClick={() => onSelect(clon)}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${selected
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
        }`}
    >
      <div className="flex items-center gap-3">
        <div>
          {clon.nombre.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold">{clon.nombre}</h3>
          <p className="text-sm text-gray-500">{clon.edad} años • {clon.genero}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {clon.categorias.map((cat) => (
          <span key={cat} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {cat}
          </span>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-400">
        {clon.comprasPorMes} compras/mes • Ticket ${clon.ticketPromedio}
      </div>
    </div>
  )
}