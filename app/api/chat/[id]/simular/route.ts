import { NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/db'
import { Clone } from '@/app/lib/models/Clone'
import { simularEscenario } from '@/app/lib/services/groq'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { escenario } = await request.json()
    const { id } = await params
    if (!escenario) {
      return NextResponse.json(
        { ok: false, error: 'El escenario es requerido' },
        { status: 400 }
      )
    }
    const clon = await Clone.findById(id)
    if (!clon) {
      return NextResponse.json(
        { ok: false, error: 'Clon no encontrado' },
        { status: 404 }
      )
    }
    const resultado = await simularEscenario(clon, escenario)
    return NextResponse.json({
      ok: true,
      clon: { id: clon._id, nombre: clon.nombre },
      escenario,
      resultado
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}