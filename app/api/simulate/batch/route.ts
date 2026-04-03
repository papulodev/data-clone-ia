import { Clone } from "@/lib/models/Clone"
import { sanitizarEscenario, simularEscenarioSchema, validarInput } from "@/lib/schemas/validation"
import { simularEscenario } from "@/lib/services/simulate"
import { NextResponse } from "next/server"

// POST /simulate/batch — simula el mismo escenario para varios clones a la vez
export async function POST(req: Request) {
  try {
    const { clonIds, escenario } = await req.json()

    if (!clonIds?.length || !escenario)
      return NextResponse.json({ ok: false, error: 'Enviá clonIds y escenario' }, { status: 400 })

    const clones = await Clone.find({ _id: { $in: clonIds } })

    if (!clones) {
      return NextResponse.json(
        { ok: false, error: 'Clones no encontrados' },
        { status: 404 }
      )
    }

    if (!escenario)
      return NextResponse.json({ ok: false, error: 'Enviá un escenario para simular' }, { status: 400 })

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

    const resultados = await Promise.all(
      clones.map(async (clon) => {
        const resultado = await simularEscenario(clon, escenarioSanitizado)
        return { clon: { id: clon._id, nombre: clon.nombre }, resultado }
      })
    )

    // Ordenamos de mayor a menor score para el frontend
    resultados.sort((a, b) => b.resultado.score.valor - a.resultado.score.valor)

    return NextResponse.json({
      ok: true,
      escenario: escenarioSanitizado,
      resultados
    })
  } catch (error) {
    console.error('Error en simulación batch:', error)
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 })
  }
}