'use client';
import { useState } from "react"
import { useForm } from "react-hook-form"
import { registerSchema } from "@/lib/schemas/auth"
import { createZodResolver } from "@/lib/schemas/zod-resolver"
import { sanitizeEmail, sanitizeString } from "@/lib/schemas/sanitization"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group";
import { LockIcon, MailIcon, Eye, EyeOff, Loader2 } from "lucide-react";

type RegisterFormData = {
  email: string
  password: string
  confirmPassword: string
}

const registerResolver = createZodResolver(registerSchema)

function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<RegisterFormData>({
    resolver: registerResolver,
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const sanitizedData = {
        email: sanitizeEmail(data.email),
        password: sanitizeString(data.password),
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Error al crear cuenta")
        setIsLoading(false)
        return
      }

      toast.success("¡Cuenta creada! Ahora podés iniciar sesión")
      router.push("/login")
      setIsLoading(false)
    } catch {
      toast.error("Error de conexión")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <FieldLabel className="text-md uppercase tracking-widest text-on-surface font-bold px-1">
          EMAIL
        </FieldLabel>
        <InputGroup className="dark:bg-surface-container-lowest/10 h-14 focus:ring-0">
          <InputGroupInput
            id="email"
            type="email"
            placeholder="tu@email.com"
            className="w-full text-white py-4 px-4 transition-all placeholder:text-on-surface/40"
            {...form.register("email")}
          />
          <InputGroupAddon >
            <MailIcon size={34} />
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          {form.formState.errors.email && (
            <span className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </span>
          )}
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel className="text-md uppercase tracking-widest text-on-surface font-bold px-1">
          CONTRASEÑA
        </FieldLabel>
        <InputGroup className="dark:bg-surface-container-lowest/10 h-14 focus:ring-0">
          <InputGroupInput
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full text-white py-4 px-4 transition-all placeholder:text-on-surface/40"
            {...form.register("password")}
          />
          <InputGroupAddon>
            <LockIcon size={34} />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff size={30} /> : <Eye size={30} />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          {form.formState.errors.password && (
            <span className="text-sm text-destructive">
              {form.formState.errors.password.message}
            </span>
          )}
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel className="text-md uppercase tracking-widest text-on-surface font-bold px-1">
          CONFIRMAR CONTRASEÑA
        </FieldLabel>
        <InputGroup className="dark:bg-surface-container-lowest/10 h-14 focus:ring-0">
          <InputGroupInput
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full text-white py-4 px-4 transition-all rounded-lg placeholder:text-on-surface/40"
            {...form.register("confirmPassword")}
          />
          <InputGroupAddon>
            <LockIcon size={34} />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="focus:outline-none cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={30} /> : <Eye size={30} />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          {form.formState.errors.confirmPassword && (
            <span className="text-sm text-destructive">
              {form.formState.errors.confirmPassword.message}
            </span>
          )}
        </FieldDescription>
      </Field>
      <Button type="submit" disabled={isLoading} className="w-full py-4 rounded-lg bg-linear-to-r from-primary to-primary-container text-on-primary font-bold text-lg glow-hover transition-all duration-300 active:scale-95 shadow-lg shadow-primary/20f h-16 hover:bg-primary/20 cursor-pointer">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          "Crear Cuenta"
        )}
      </Button>
    </form>
  )
}

export default RegisterForm
