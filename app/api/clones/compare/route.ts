import { Clone } from "@/app/lib/models/Clone"
import { compararClones } from "@/app/lib/services/compare"
import { NextResponse } from "next/server"
import { connectDB } from "@/app/lib/db"
import { compararClonesSchema, validarInput } from "@/app/lib/schemas/validation"

export const POST = async (req: Request) => {
  try {
    await connectDB()
    const body = await req.json()

    // Validar el cuerpo de la solicitud con Zod
    const validacion = validarInput(compararClonesSchema, body)
    if (!validacion.success) {
      return NextResponse.json(
        { ok: false, error: validacion.error },
        { status: 400 }
      )
    }

    const { clonAId, clonBId } = validacion.data!

    // Traemos ambos clones CON embedding (necesario para cosine similarity)
    const [clonA, clonB] = await Promise.all([
      Clone.findById(clonAId),
      Clone.findById(clonBId)
    ])

    if (!clonA) {
      return NextResponse.json(
        { ok: false, error: "Clon A no encontrado" },
        { status: 404 }
      )
    }
    
    if (!clonB) {
      return NextResponse.json(
        { ok: false, error: "Clon B no encontrado" },
        { status: 404 }
      )
    }

    // Verificar que ambos clones estén activos
    if (!clonA.activo || !clonB.activo) {
      return NextResponse.json(
        { ok: false, error: "Uno de los clones no está activo" },
        { status: 400 }
      )
    }

    const resultado = await compararClones(clonA, clonB)

    return NextResponse.json({ ok: true, comparacion: resultado })

  } catch (error) {
    console.error("Error comparando clones:", error)
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
