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
export async function crearClon(datos: Omit<Clone, '_id' | 'resumenPersonalidad' | 'activo' | 'creadoEn'>): Promise<{ ok: boolean; clon: Clone }> {
  const res = await fetch('/api/clones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  return res.json()
}
export async function crearClonesMock(): Promise<{ ok: boolean; clones: { id: string; nombre: string }[] }> {
  const res = await fetch('/api/clones/mock', { method: 'POST' })
  return res.json()
}
export async function chatear(id: string, mensaje: string): Promise<{ ok: boolean; respuesta: string }> {
  const res = await fetch(`/api/chat/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensaje })
  })
  return res.json()
}
export async function simular(id: string, escenario: string): Promise<{ ok: boolean; resultado: string }> {
  const res = await fetch(`/api/chat/${id}/simular`, {
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