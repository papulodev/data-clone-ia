import { connectDB } from "@/app/lib/db"
import { Clone } from "@/app/lib/models/Clone"
import { crearChat } from "@/app/lib/services/groq"
import { NextResponse } from "next/server"
import { mensajeSchema, sanitizarMensaje, validarInput } from "@/app/lib/schemas/validation"
import mongoose from "mongoose"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { id } = await params

    // Validar que el ID sea un ObjectId válido
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: 'ID de clon inválido' },
        { status: 400 }
      )
    }

    // Validar el mensaje con Zod
    const validacion = validarInput(mensajeSchema, { mensaje: body.mensaje })
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

    const respuesta = await crearChat(clon, mensajeSanitizado)

    return NextResponse.json({
      ok: true,
      clon: { id: clon._id, nombre: clon.nombre },
      respuesta
    })
  } catch (error) {
    console.error("Error en chat:", error)
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
