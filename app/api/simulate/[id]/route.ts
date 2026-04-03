import { Clone } from "@/lib/models/Clone"
import { sanitizarEscenario, simularEscenarioSchema, validarInput } from "@/lib/schemas/validation"
import { simularEscenario } from "@/lib/services/simulate"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

// POST /simulate/:clonId — simula un escenario para un clon
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { escenario } = await req.json()

    // Validar que el ID sea un ObjectId válido
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, error: 'ID de clon inválido' },
        { status: 400 }
      )
    }

    // Validar el escenario con Zod
    const validacion = validarInput(simularEscenarioSchema, { escenario })
    if (!validacion.success) {
      return NextResponse.json(
        { ok: false, error: validacion.error },
        { status: 400 }
      )
    }

    // Sanitizar el escenario antes de enviar
    const escenarioSanitizado = sanitizarEscenario(validacion.data!).escenario

    if (!escenario)
      return NextResponse.json({ ok: false, error: 'Enviá un escenario para simular' }, { status: 400 })

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
      clon: {
        id: clon._id,
        nombre: clon.nombre
      },
      simulacion: resultado
    })

  } catch (error) {
    console.error('Error simulando escenario:', error)
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 })
  }
}