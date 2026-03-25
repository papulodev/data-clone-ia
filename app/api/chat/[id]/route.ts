import { connectDB } from "@/app/lib/db"
import { Clone } from "@/app/lib/models/Clone"
import { crearChat } from "@/app/lib/services/groq"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { mensaje } = await request.json()
    const { id } = await params

    if (!mensaje) {
      return NextResponse.json(
        { ok: false, error: 'El mensaje es requerido' },
        { status: 400 }
      )
    }

    const clon = await Clone.findById(id)

    if (!clon) {
      return NextResponse.json(
        { ok: false, error: 'Clone no encontrado' },
        { status: 404 }
      )
    }

    const respuesta = await crearChat(clon, mensaje)

    return NextResponse.json({
      ok: true,
      clon: { id: clon._id, nombre: clon.nombre },
      respuesta
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}