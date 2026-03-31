import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { auth } from "@/auth"
import LoginForm from "@/components/forms/LoginForm"
import BackgroundNebula from "@/components/BackgroundNebula"

export default async function LoginPage() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="nebula-bg font-inter text-on-surface min-h-screen flex flex-col justify-center items-center selection:bg-primary/30">
      <BackgroundNebula />
      <div className="glass-card w-full max-w-[480px] p-10 md:p-12 rounded-xl flex flex-col gap-8 shadow-2xl relative overflow-hidden">
        <Card className="bg-transparent ring-0 gap-8">
          <CardHeader className="space-y-2 p-0">
            <CardTitle className="text-4xl text-center font-extrabold tracking-tighter font-headline text-white">Iniciar sesión</CardTitle>
            <CardDescription className="text-on-surface/60 font-medium text-center text-lg">
              Ingresa a tu ecosistema digital inteligente.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <LoginForm />
          </CardContent>
          <CardFooter className="w-full flex flex-row justify-center items-center gap-2 bg-transparent">
            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta?
            </p>
            <Button variant="link" size="sm" asChild>
              <Link href="/register">Crear cuenta</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
