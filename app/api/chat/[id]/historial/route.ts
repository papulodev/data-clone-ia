import { connectDB } from "@/app/lib/db";
import { Conversation } from "@/lib/models/Convesation"
import { NextResponse } from "next/server"

// GET /chat/:clonId/historial — trae el historial completo
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params
    const url = new URL(request.url)
    const conversacionId = url.searchParams.get('conversacionId')

    const query = conversacionId
      ? { _id: conversacionId, clonId: id }
      : { clonId: id }

    const conversacion = await Conversation.findOne(query).sort({ creadoEn: -1 })
    console.log(conversacion)

    if (!conversacion)
      return NextResponse.json({ ok: true, mensajes: [], conversacionId: null })

    return NextResponse.json({
      ok: true,
      conversacionId: conversacion._id,
      mensajes: conversacion.mensajes
    })

  } catch (error) {
    console.error("Error en historial:", error)
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 })
  }
}

// DELETE /chat/:clonId/historial — borra el historial (reset del chat)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params
    await Conversation.deleteMany({ clonId: id })
    return NextResponse.json({ ok: true, message: 'Historial borrado exitosamente' })
  } catch (error) {
    console.error("Error al borrar historial:", error)
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 })
  }
}