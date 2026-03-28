import OpenAI from "openai"
import { cosineSimilarity } from "./embedding"

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
})

export const compararClones = async (clonA: any, clonB: any) => {

  // 1. Score numérico de similitud
  const similaridad = cosineSimilarity(clonA.embedding, clonB.embedding)
  const porcentaje = Math.round(similaridad * 100)

  // 2. Análisis cualitativo con IA
  const prompt = `
    Tenés dos perfiles de clientes digitales. Analizá sus diferencias y similitudes
    de forma concisa. Respondé SOLO en JSON con esta estructura exacta, sin texto extra:

    {
      "resumen": "2 oraciones comparando ambos perfiles",
      "diferencias": ["diferencia 1", "diferencia 2", "diferencia 3"],
      "similitudes": ["similitud 1", "similitud 2"],
      "recomendacion": "1 recomendación de negocio basada en la comparación",
      "ganadorDescuentos": "nombre del clon más sensible a descuentos",
      "ganadorTicket": "nombre del clon con mayor ticket promedio",
      "ganadorFrecuencia": "nombre del clon que compra más frecuentemente"
    }

    Perfil A — ${clonA.nombre}:
    ${clonA.resumenPersonalidad}

    Perfil B — ${clonB.nombre}:
    ${clonB.resumenPersonalidad}
  `

  const response = await groq.chat.completions.create({
    model: 'openai/gpt-oss-20b',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4
  })

  const raw = response.choices[0].message.content || '{}'
  const analisis = JSON.parse(raw.replace(/```json|```/g, '').trim())

  return {
    clonA: { id: clonA._id, nombre: clonA.nombre },
    clonB: { id: clonB._id, nombre: clonB.nombre },
    similitud: {
      porcentaje,
      nivel: porcentaje >= 70 ? 'alta' : porcentaje >= 40 ? 'media' : 'baja'
    },
    analisis
  }
}