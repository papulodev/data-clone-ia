import { connectDB } from "@/app/lib/db"
import { Clone } from "@/lib/models/Clone"
import { chatConClon } from "@/lib/services/chat"
import { NextResponse } from "next/server"
import { mensajeSchema, sanitizarMensaje, validarInput } from "@/lib/schemas/validation"
import mongoose from "mongoose"
import { Conversation } from "@/lib/models/Convesation"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await params
    const { pregunta, conversacionId } = await request.json()

    // Validar que el ID sea un ObjectId válido
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: 'ID de clon inválido' },
        { status: 400 }
      )
    }

    if (!pregunta?.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Enviá una pregunta' },
        { status: 400 }
      )
    }

    // Validar el mensaje con Zod
    const validacion = validarInput(mensajeSchema, { mensaje: pregunta })
    if (!validacion.success) {
      return NextResponse.json(
        { ok: false, error: validacion.error },
        { status: 400 }
      )
    }

    // Sanitizar el mensaje antes de enviar
    const mensajeSanitizado = sanitizarMensaje(validacion.data!).mensaje

    const clon = await Clone.findById(id)

    if (!clon) {
      return NextResponse.json(
        { ok: false, error: 'Clone no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el clon esté activo
    if (!clon.activo) {
      return NextResponse.json(
        { ok: false, error: 'El clon no está activo' },
        { status: 400 }
      )
    }

    // 2. Buscar o crear la conversación
    let conversacion
    if (conversacionId) {
      conversacion = await Conversation.findById(conversacionId)
    }
    if (!conversacion) {
      conversacion = await Conversation.create({ clonId: id, mensajes: [] })
    }

    // 3. Generar respuesta del clon
    const respuesta = await chatConClon(clon, conversacion.mensajes, mensajeSanitizado)

    // 4. Guardar ambos mensajes en el historial
    conversacion.mensajes.push({ role: 'user', content: mensajeSanitizado })
    conversacion.mensajes.push({ role: 'assistant', content: respuesta })
    conversacion.actualizadoEn = new Date()
    await conversacion.save()

    return NextResponse.json({
      ok: true,
      conversacionId: conversacion._id,
      clon: { id: clon._id, nombre: clon.nombre },
      respuesta,
      totalMensajes: conversacion.mensajes.length
    })
  } catch (error) {
    console.error("Error en chat:", error)
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
