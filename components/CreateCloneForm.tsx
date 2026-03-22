'use client'
import { useState } from 'react'
import { crearClon } from '@/app/lib/api'
interface Props {
  onCreated: () => void
}
export default function CreateCloneForm({ onCreated }: Props) {
  const [form, setForm] = useState({
    nombre: '',
    edad: 25,
    genero: 'masculino' as 'masculino' | 'femenino' | 'otro',
    comprasPorMes: 1,
    ticketPromedio: 5000,
    sensibleDescuentos: false,
    categorias: '',
    historial: ''
  })
  const [cargando, setCargando] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    const datos = {
      ...form,
      categorias: form.categorias.split(',').map((c) => c.trim()).filter(Boolean),
      historial: form.historial.split('\n').filter((h) => h.trim())
    }
    try {
      await crearClon(datos)
      onCreated()
      setForm({
        nombre: '',
        edad: 25,
        genero: 'masculino',
        comprasPorMes: 1,
        ticketPromedio: 5000,
        sensibleDescuentos: false,
        categorias: '',
        historial: ''
      })
    } catch (error) {
      console.error(error)
    }
    setCargando(false)
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          type="text"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Edad</label>
          <input
            type="number"
            value={form.edad}
            onChange={(e) => setForm({ ...form, edad: Number(e.target.value) })}
            className="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Género</label>
          <select
            value={form.genero}
            onChange={(e) => setForm({ ...form, genero: e.target.value as typeof form.genero })}
            className="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Compras por mes</label>
          <input
            type="number"
            value={form.comprasPorMes}
            onChange={(e) => setForm({ ...form, comprasPorMes: Number(e.target.value) })}
            className="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Ticket promedio ($)</label>
          <input
            type="number"
            value={form.ticketPromedio}
            onChange={(e) => setForm({ ...form, ticketPromedio: Number(e.target.value) })}
            className="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.sensibleDescuentos}
            onChange={(e) => setForm({ ...form, sensibleDescuentos: e.target.checked })}
          />
          <span className="text-sm font-medium">Sensible a descuentos</span>
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium">Categorías (separadas por coma)</label>
        <input
          type="text"
          value={form.categorias}
          onChange={(e) => setForm({ ...form, categorias: e.target.value })}
          placeholder="ropa, electrónica, hogar"
          className="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Historial (una línea por evento)</label>
        <textarea
          value={form.historial}
          onChange={(e) => setForm({ ...form, historial: e.target.value })}
          placeholder="Compró zapatillas en enero
Abandonó carrito de $5000"
          rows={3}
          className="w-full mt-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        />
      </div>
      <button
        type="submit"
        disabled={cargando}
        className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
      >
        {cargando ? 'Creando...' : 'Crear Clon'}
      </button>
    </form>
  )
}