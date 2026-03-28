import { NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/db'
import { Clone } from '@/app/lib/models/Clone'
import { simularEscenario } from '@/app/lib/services/groq'
import { simularEscenarioSchema, sanitizarEscenario, validarInput } from '@/app/lib/schemas/validation'
import mongoose from 'mongoose'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Validar el escenario con Zod
    const validacion = validarInput(simularEscenarioSchema, { escenario: body.escenario })
    if (!validacion.success) {
      return NextResponse.json(
        { ok: false, error: validacion.error },
        { status: 400 }
      )
    }

    // Sanitizar el escenario antes de enviar
    const escenarioSanitizado = sanitizarEscenario(validacion.data!).escenario

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

    const resultado = await simularEscenario(clon, escenarioSanitizado)
    
    return NextResponse.json({
      ok: true,
      clon: { id: clon._id, nombre: clon.nombre },
      escenario: escenarioSanitizado,
      resultado
    })
  } catch (error) {
    console.error("Error en simulación:", error)
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
