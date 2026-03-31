import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HF_TOKEN);

interface DatosClon {
  nombre: string
  edad: number
  genero: string
  comprasPorMes: number
  ticketPromedio: number
  sensibleDescuentos: boolean
  categorias: string[]
  historial: string[]
  resumenPersonalidad: string
}

// Calcula un score base 0-100 usando los atributos del clon
const calcularScoreBase = (clon: DatosClon, escenario: string) => {
  const escenarioLower = escenario.toLowerCase()

  // — Frecuencia de compra (30 puntos)
  // Más compras por mes = más probable que compre
  const maxFrecuencia = 8
  const scoreFrecuencia = Math.min(clon.comprasPorMes / maxFrecuencia, 1) * 30

  // — Sensibilidad a descuentos (25 puntos)
  // Si el escenario menciona descuento/oferta y el clon es sensible → sube
  // Si el escenario menciona subida de precio y el clon es sensible → baja
  let scoreDescuento = 0
  const mencionaDescuento = /descuento|oferta|promo|rebaja|sale/i.test(escenarioLower)
  const mencionaSubida = /sube|subida|aumento|caro|precio/i.test(escenarioLower)

  if (clon.sensibleDescuentos && mencionaDescuento) scoreDescuento = 25
  else if (clon.sensibleDescuentos && mencionaSubida) scoreDescuento = 5
  else if (!clon.sensibleDescuentos && mencionaDescuento) scoreDescuento = 15
  else scoreDescuento = 15 // neutro

  // — Ticket promedio (25 puntos)
  // Tickets bajos = más dispuesto a comprar en general
  const maxTicket = 20000
  const scoreTicket = (1 - Math.min(clon.ticketPromedio / maxTicket, 1)) * 25

  // — Historial relevante (20 puntos)
  // Cuántas palabras del escenario aparecen en el historial del clon
  const palabrasEscenario = escenarioLower.split(' ').filter(p => p.length > 3)
  const historialTexto = clon.historial.join(' ').toLowerCase()
  const matches = palabrasEscenario.filter(p => historialTexto.includes(p)).length
  const scoreHistorial = Math.min(matches / 3, 1) * 20

  const total = scoreFrecuencia + scoreDescuento + scoreTicket + scoreHistorial
  return Math.round(Math.min(total, 100))
}

export const simularEscenario = async (clon: DatosClon, escenario: string) => {

  // 1. Score base con la fórmula
  const scoreBase = calcularScoreBase(clon, escenario)

  // 2. La IA ajusta el score y genera el análisis
  const prompt = `
    Sos un sistema de análisis de comportamiento de clientes.
    
    Perfil del cliente:
    ${clon.resumenPersonalidad}
    
    Escenario a simular: "${escenario}"
    
    Score base calculado: ${scoreBase}/100
    
    Analizá el escenario y respondé SOLO en JSON con esta estructura exacta, sin texto extra:
    {
      "scoreAjustado": <número entre 0 y 100, ajustá el score base según el contexto>,
      "comportamientoEsperado": [
        "<acción concreta que haría este cliente 1>",
        "<acción concreta que haría este cliente 2>",
        "<acción concreta que haría este cliente 3>"
      ],
      "razonamiento": "<1 oración explicando por qué ese score>",
      "recomendacion": "<1 acción de negocio concreta para este cliente>"
    }
  `

  const response = await hf.chatCompletion({
    model: 'mistralai/Mistral-7B-Instruct-v0.3',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 400,
    temperature: 0.3,
  })

  const raw = response.choices[0].message.content || ""
  const analisis = JSON.parse(raw.replace(/```json|```/g, '').trim())

  if (!analisis.scoreAjustado || !analisis.comportamientoEsperado || !analisis.razonamiento || !analisis.recomendacion) {
    throw new Error("No se pudo generar el análisis")
  }

  // 3. Nivel según el score final
  const score = analisis.scoreAjustado
  const nivel = score >= 70 ? 'alto' : score >= 40 ? 'medio' : 'bajo'
  const color = score >= 70 ? 'teal' : score >= 40 ? 'amber' : 'red'

  return {
    escenario,
    score: {
      valor: score,
      nivel,
      color,
      scoreBase,
      ajuste: score - scoreBase
    },
    comportamientoEsperado: analisis.comportamientoEsperado,
    razonamiento: analisis.razonamiento,
    recomendacion: analisis.recomendacion
  }
}