'use client'
import { useEffect, useState } from 'react'
import { Clone, listarClones, crearClonesMock } from '@/app/lib/api'
import CloneCard from '@/components/CloneCard'
import ChatWindow from '@/components/ChatWindow'
import CreateCloneForm from '@/components/CreateCloneForm'
import SimulatePanel from '@/components/SimulatePanel'

export default function Dashboard() {
  const [clones, setClones] = useState<Clone[]>([])
  const [selectedClone, setSelectedClone] = useState<Clone | null>(null)
  const [activeTab, setActiveTab] = useState<'chat' | 'crear' | 'simular'>('chat')
  const [cargando, setCargando] = useState(true)
  const cargarClones = async () => {
    setCargando(true)
    const res = await listarClones()
    if (res.ok) {
      setClones(res.clones)
    }
    setCargando(false)
  }
  useEffect(() => {
    cargarClones()
  }, [])
  const handleCrearMock = async () => {
    await crearClonesMock()
    cargarClones()
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🧬 DataClone AI</h1>
            <p className="text-sm text-gray-500">Gemelos digitales de clientes</p>
          </div>
          <button
            onClick={handleCrearMock}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
          >
            Cargar Clones Demo
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Lista de clones */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-semibold text-lg">Clones ({clones.length})</h2>
            {cargando ? (
              <p className="text-gray-500">Cargando...</p>
            ) : clones.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No hay clones todavía.</p>
                <p className="text-sm">Creá uno o cargá los de demo.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {clones.map((clon) => (
                  <CloneCard
                    key={clon._id}
                    clon={clon}
                    selected={selectedClone?._id === clon._id}
                    onSelect={setSelectedClone}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Main - Panel derecho */}
          <div className="lg:col-span-2">
            {!selectedClone ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center text-gray-500">
                <p className="text-lg">Seleccioná un clon para chatear</p>
                <p className="text-sm mt-2">O creá uno nuevo usando el formulario</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-6 py-3 font-medium ${activeTab === 'chat'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    💬 Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('crear')}
                    className={`px-6 py-3 font-medium ${activeTab === 'crear'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    ➕ Crear
                  </button>
                  <button
                    onClick={() => setActiveTab('simular')}
                    className={`px-6 py-3 font-medium ${activeTab === 'simular'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    🔮 Simular
                  </button>
                </div>
                {/* Content */}
                <div className="h-[500px]">
                  {activeTab === 'chat' && <ChatWindow clon={selectedClone} />}
                  {activeTab === 'crear' && <CreateCloneForm onCreated={cargarClones} />}
                  {activeTab === 'simular' && <SimulatePanel clon={selectedClone} />}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
