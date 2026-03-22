import { connectDB } from "@/app/lib/db"
import { Clone } from "@/app/lib/models/Clone"
import { generarResumenPersonalidad } from "@/app/lib/services/embedding"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB()
    const clones = await Clone.find({ activo: true }).sort({ creadoEn: -1 })

    return NextResponse.json({ ok: true, total: clones.length, clones })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const datos = await request.json()

    const resumenPersonalidad = generarResumenPersonalidad(datos)

    const clon = await Clone.create({
      ...datos,
      resumenPersonalidad,
      // embedding: await generarEmbedding(resumenPersonalidad)
    })

    return NextResponse.json({
      ok: true,
      mensaje: 'Clone creado exitosamente',
      clon: {
        id: clon._id,
        nombre: clon.name,
        resumenPersonalidad: clon.resumenPersonalidad
      }
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}