export interface Clone {
  _id: string
  nombre: string
  edad: number
  genero: string
  comprasPorMes: number
  ticketPromedio: number
  sensibleDescuentos: boolean
  categorias: string[]
  historial: string[]
  resumenPersonalidad: string
  activo: boolean
  creadoEn: string
}
export async function listarClones(): Promise<{ ok: boolean; clones: Clone[]; total: number }> {
  const res = await fetch('/api/clones')
  return res.json()
}

export async function obtenerClon(id: string): Promise<{ ok: boolean; clon: Clone }> {
  const res = await fetch(`/api/clones/${id}`)
  return res.json()
}

export async function crearClon(datos: Omit<Clone, '_id' | 'resumenPersonalidad' | 'activo' | 'creadoEn'>): Promise<{ ok: boolean; clon: Clone }> {
  const res = await fetch('/api/clones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  return res.json()
}
export async function crearClonesMock(): Promise<{ ok: boolean; clones: { id: string; nombre: string }[] }> {
  const res = await fetch('/api/clones/mock', {
    method: 'POST',
    credentials: 'include'
  })
  return res.json()
}
export async function chatear(id: string, mensaje: string, conversacionId?: string): Promise<{ ok: boolean; respuesta: string; conversacionId?: string }> {
  const res = await fetch(`/api/chat/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pregunta: mensaje, conversacionId })
  })
  return res.json()
}

export async function obtenerHistorial(id: string, conversacionId?: string): Promise<{ ok: boolean; mensajes?: any[]; conversacionId?: string; error?: string }> {
  const params = conversacionId ? `?conversacionId=${conversacionId}` : ''
  const res = await fetch(`/api/chat/${id}/historial${params}`)
  return res.json()
}

export async function borrarHistorial(id: string): Promise<{ ok: boolean; message: string }> {
  const res = await fetch(`/api/chat/${id}/historial`, {
    method: 'DELETE'
  })
  return res.json()
}

type SimulationResult = {
  escenario: string,
  score: {
    valor: number,
    nivel: string,
    color: string,
    scoreBase: number,
    ajuste: number
  },
  comportamientoEsperado: string[],
  razonamiento: string,
  recomendacion: string
}

export async function simularEscenario(id: string, escenario: string): Promise<{ ok: boolean; simulacion: SimulationResult }> {
  const res = await fetch(`/api/simulate/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ escenario })
  })
  return res.json()
}

export interface Comparacion {
  similitud: {
    porcentaje: number;
    nivel: string;
  };
  clonA: { id: string; nombre: string };
  clonB: { id: string; nombre: string };
  analisis: {
    resumen: string;
    similitudes: string[];
    diferencias: string[];
    recomendacion: string;
    ganadorDescuentos: string;
    ganadorTicket: string;
    ganadorFrecuencia: string;
  }
}

export async function compararClones(clonAId: string, clonBId: string): Promise<{ ok: boolean; comparacion?: Comparacion; error?: string }> {
  const res = await fetch('/api/clones/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clonAId, clonBId })
  })
  return res.json()
}

export async function simularBatch(clonIds: string[], escenario: string): Promise<{ ok: boolean; escenario: string; resultados: any[] }> {
  const res = await fetch('/api/simulate/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clonIds, escenario })
  })
  return res.json()
}

export async function simularBatchIndividual(id: string, escenario: string): Promise<{ ok: boolean; escenario: string; resultados: any[] }> {
  const res = await fetch(`/api/simulate/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ escenario })
  })
  return res.json()
}