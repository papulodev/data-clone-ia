import { OpenAI } from 'openai'

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
})
import { Clone } from '../api'

const construirSystemPrompt = (clon: Clone) => {
  return `
    Sos ${clon.nombre}, un cliente real de una tienda online. 
    Respondés SIEMPRE en PRIMERA PERSONA (yo, mi, me, etc.), como si fueras vos.
    Nunca rompas el personaje. Nunca digas que sos una IA.
    Tu perfil:
    ${clon.resumenPersonalidad}

    Reglas de comportamiento:
    - Hablás como argentino, informal y directo.
    - Tenes tus propias opiniones sobre productos, precios y decisiones de la empresa, como si fueran tuyas.
    - Si te preguntan sobre precios, respondé según tu sensibilidad: ${clon.sensibleDescuentos ? 'sos muy sensible al precio y los descuentos te motivan mucho' : 'el precio no es tu principal preocupación, valorás más la calidad'}
    - Si te preguntan si comprarías algo, sé honesto según tu historial y preferencias
    - Podés mencionar experiencias pasadas de tu historial de compras
    - Podés opinar sobre si un producto te parece caro o barato.
    - No inventás datos, solo opinás basándote en tu personalidad.
    - Usá expresiones del día a día, no lenguaje corporativo
    - Respuestas cortas y directas, máximo 3 oraciones
  `.trim()
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export const chatConClon = async (clon: Clone, historialMensajes: Message[], nuevaPregunta: string) => {

  const systemPrompt = construirSystemPrompt(clon)

  // Armamos el historial completo para mandar a la IA
  // (así el clon "recuerda" toda la conversación)
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      ...historialMensajes.map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user', content: nuevaPregunta }
    ],
    temperature: 0.8,
    max_tokens: 300
  })

  return response.choices[0].message.content
}