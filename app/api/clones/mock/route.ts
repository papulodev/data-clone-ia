import { connectDB } from "@/app/lib/db"
import { Clone } from "@/app/lib/models/Clone"
import { generarEmbedding, generarResumenPersonalidad } from "@/app/lib/services/embedding"
import { NextResponse } from "next/server"

export const clientesMock = [
  {
    nombre: "María García",
    edad: 29,
    genero: "femenino",
    comprasPorMes: 2,
    ticketPromedio: 4500,
    sensibleDescuentos: true,
    categorias: ["ropa", "calzado", "accesorios"],
    historial: [
      "compró zapatillas Nike en enero",
      "abrió email de 30% off y compró al instante",
      "abandonó carrito de cartera de $8000",
      "volvió 3 días después y la compró con descuento"
    ]
  },
  {
    nombre: "Carlos López",
    edad: 42,
    genero: "masculino",
    comprasPorMes: 1,
    ticketPromedio: 12000,
    sensibleDescuentos: false,
    categorias: ["electrónica", "herramientas"],
    historial: [
      "compró notebook gamer en marzo",
      "visitó página de monitores 5 veces sin comprar",
      "ignoró todos los emails promocionales",
      "compró solo cuando necesitaba algo puntual"
    ]
  }
]

export async function POST() {
  try {
    await connectDB()
    const clones = []

    for (const datos of clientesMock) {
      const resumenPersonalidad = generarResumenPersonalidad(datos)
      const embedding = await generarEmbedding(datos)
      const clon = await Clone.create({
        ...datos,
        resumenPersonalidad,
        embedding
      })
      clones.push({ id: clon._id, nombre: clon.nombre })
    }

    return NextResponse.json({
      ok: true,
      mensaje: `${clones.length} clones creados exitosamente`,
      clones
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}