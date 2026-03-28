import { InferenceClient } from "@huggingface/inference"

interface DatosClon {
  nombre: string
  edad: number
  genero: string
  comprasPorMes: number
  ticketPromedio: number
  sensibleDescuentos: boolean
  categorias: string[]
  historial: string[]
}

const hf = new InferenceClient(process.env.HF_TOKEN);

export const generarEmbedding = async (datos: DatosClon) => {
  const texto = `
    Cliente: ${datos.nombre}, ${datos.edad} años, género: ${datos.genero}.
    Compras por mes: ${datos.comprasPorMes}.
    Ticket promedio: $${datos.ticketPromedio}.
    Sensible a descuentos: ${datos.sensibleDescuentos ? 'sí' : 'no'}.
    Categorías favoritas: ${datos.categorias.join(', ')}.
    Historial: ${datos.historial.join('. ')}.
  `

  const response = await hf.featureExtraction({
    model: 'BAAI/bge-m3',
    inputs: texto,
  })

  const embedding = Array.isArray(response[0]) ? response[0] : response

  return embedding
}

export const generarResumenPersonalidad = (datos: DatosClon) => {
  const frecuencia = datos.comprasPorMes >= 3
    ? 'comprás frecuentemente'
    : datos.comprasPorMes === 2
      ? 'comprás cada dos semanas'
      : 'comprás una vez al mes'

  const descuento = datos.sensibleDescuentos
    ? 'Sos muy sensible a los descuentos y promociones — casi siempre esperás una oferta para comprar.'
    : 'No te importan mucho los descuentos, comprás cuando lo necesitás independientemente del precio.'

  return `Sos ${datos.nombre}, tenés ${datos.edad} años. ${frecuencia} con un ticket promedio de $${datos.ticketPromedio}. Tus categorías favoritas son ${datos.categorias.join(' y ')}. ${descuento} Tu historial muestra: ${datos.historial.join(', ')}.`
}

export const cosineSimilarity = (vecA: number[], vecB: number[]) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}