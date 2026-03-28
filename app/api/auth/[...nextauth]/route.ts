import { NextResponse } from "next/server"
import { connectDB } from "@/app/lib/db"
import { User } from "@/lib/models/User"
import { hashPassword } from "@/lib/auth-utils"
import { registerSchema } from "@/lib/schemas/auth"

export { auth as proxy } from "@/auth"

export async function POST(request: Request) {
  try {
    await connectDB()

    const body = await request.json()

    const validation = registerSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const user = await User.create({
      email,
      password: hashedPassword,
    })

    return NextResponse.json(
      { message: "Usuario creado exitosamente", userId: user._id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "Error al registrar usuario" },
      { status: 500 }
    )
  }
}
