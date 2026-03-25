import { connectDB } from "@/app/lib/db"
import { Clone } from "@/app/lib/models/Clone"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const clon = await Clone.findById(id).select('-embedding')

    if (!clon) {
      return NextResponse.json(
        { ok: false, error: 'Clone no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true, clon })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}