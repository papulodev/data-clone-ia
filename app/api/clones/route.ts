import { connectDB } from "@/app/lib/db"
import { Clone } from "@/lib/models/Clone"
import { generarEmbedding, generarResumenPersonalidad } from "@/lib/services/embedding"
import { NextResponse } from "next/server"
import { crearClonSchema, sanitizarDatosClon, validarInput } from "@/lib/schemas/validation"

export async function GET() {
  try {
    await connectDB()
    const clones = await Clone.find({ activo: true }).select('-embedding').sort({ creadoEn: -1 })

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

    // Validar datos del cuerpo de la solicitud
    const validacion = validarInput(crearClonSchema, datos)
    if (!validacion.success) {
      return NextResponse.json(
        { ok: false, error: validacion.error },
        { status: 400 }
      )
    }

    // Sanitizar datos antes de procesar
    const datosSanitizados = sanitizarDatosClon(validacion.data!)

    const resumenPersonalidad = generarResumenPersonalidad(datosSanitizados)
    const embedding = await generarEmbedding(datosSanitizados)

    const clon = await Clone.create({
      ...datosSanitizados,
      resumenPersonalidad,
      embedding
    })

    return NextResponse.json({
      ok: true,
      mensaje: 'Clone creado exitosamente',
      clon: {
        id: clon._id,
        nombre: clon.nombre,
        resumenPersonalidad: clon.resumenPersonalidad
      }
    })
  } catch (error) {
    console.error("Error al crear clon:", error)
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
