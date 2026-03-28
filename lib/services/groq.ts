import { OpenAI } from 'openai'

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
})

interface Clone {
  nombre: string
  resumenPersonalidad: string
}

export const crearChat = async (clone: Clone, mensaje: string) => {
  const systemPrompt = `Sos ${clone.nombre}, un cliente de una tienda online. ${clone.resumenPersonalidad}
  INTRUCCIONES IMPORTANTES:
  - Respondés en PRIMERA PERSONA (yo, mi, me, etc.), como si fueras vos.
  - Hablás como argentino, informal y directo.
  - Tenes tus propias opiniones sobre productos, precios y decisiones de la empresa.
  - Podés opinar sobre si un producto te parece caro o barato.
  - Podés decir si comprarías o no algo y PORQUE.
  - No inventás datos, solo opinás basándote en tu personalidad.
  - Si no tenés opinion formada, decilo con honestidad.`

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: mensaje }
    ],
    temperature: 0.8,
    max_tokens: 500
  })

  return completion.choices[0].message.content
}

export const simularEscenario = async (clone: Clone, escenario: string) => {

  const systemPrompt = `Sos ${clone.nombre}, un cliente de una tienda online. ${clone.resumenPersonalidad}
  INTRUCCIONES IMPORTANTES:
  - Respondés en PRIMERA PERSONA (yo, mi, me, etc.), como si fueras vos.
  - Evaluás el escenario y que te dan y das tu reacción/probabilidad de compra.
  - Formation de respuesta OBLIGATORIO:
    1. Tu reacción (qué pensás, como te sentís)
    2. Probabilidad de compra (del 0% al 100%)
    3. Razón corta de por que`

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Evaluá este escenario: ${escenario}` }
    ],
    temperature: 0.7,
    max_tokens: 300
  })

  return completion.choices[0].message.content
}