import { Clone } from "@/app/lib/models/Clone"
import { compararClones } from "@/app/lib/services/compare"
import { NextResponse } from "next/server"
import { connectDB } from "@/app/lib/db"

export const POST = async (req: Request) => {
  try {
    await connectDB()
    const { clonAId, clonBId } = await req.json()

    if (!clonAId || !clonBId)
      return NextResponse.json({ ok: false, error: 'Necesitás enviar clonAId y clonBId' }, { status: 400 })

    if (clonAId === clonBId)
      return NextResponse.json({ ok: false, error: 'Los dos clones deben ser distintos' }, { status: 400 })

    // Traemos ambos clones CON embedding (necesario para cosine similarity)
    const [clonA, clonB] = await Promise.all([
      Clone.findById(clonAId),
      Clone.findById(clonBId)
    ])

    if (!clonA) return NextResponse.json({ ok: false, error: `Clon A no encontrado` }, { status: 404 })
    if (!clonB) return NextResponse.json({ ok: false, error: `Clon B no encontrado` }, { status: 404 })

    const resultado = await compararClones(clonA, clonB)

    return NextResponse.json({ ok: true, comparacion: resultado })

  } catch (error) {
    console.error('Error comparando clones:', error)
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 })
  }
}