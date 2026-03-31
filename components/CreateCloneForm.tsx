'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { crearClon } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "./ui/field";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { Dna } from "lucide-react";
import { CloneFormData, cloneSchema } from "@/lib/schemas/clone";

export function CreateCloneForm() {
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<CloneFormData>({
    defaultValues: {
      nombre: "",
      edad: 30,
      genero: "masculino",
      comprasPorMes: 2,
      ticketPromedio: 5000,
      sensibleADescuentos: false,
      categorias: "",
      historial: "",
    },
  });

  // Watch para checkbox
  const sensibleADescuentos = watch("sensibleADescuentos");

  const validateForm = (data: CloneFormData): boolean => {
    const result = cloneSchema.safeParse(data);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    return true;
  };

  const onSubmit = async (data: CloneFormData) => {
    // Validar con Zod antes de enviar
    if (!validateForm(data)) {
      toast.error("Por favor, corregí los errores del formulario");
      return;
    }

    setLoading(true);

    try {
      const response = await crearClon({
        nombre: data.nombre,
        edad: data.edad,
        genero: data.genero,
        comprasPorMes: data.comprasPorMes,
        ticketPromedio: data.ticketPromedio,
        sensibleDescuentos: data.sensibleADescuentos,
        categorias: data.categorias
          ?.split(",")
          .map((c) => c.trim())
          .filter(Boolean) || [],
        historial: data.historial
          ?.split("\n")
          .filter((h) => h.trim()) || [],
      });

      if (response.ok && response.clon) {
        toast.success('Clon creado exitosamente.');
        console.log("Clon creado exitosamente: ", response.clon);
        reset(); // Resetear formulario
      } else {
        toast.error('Ups, hubo un error al crear el clon.');
      }
    } catch (error) {
      toast.error('Ups, hubo un error. Intentá de nuevo.');
      console.error("Error al crear el clon: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Form */}
        <div className="glass-panel border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre */}
            <Field>
              <FieldLabel className="text-muted-foreground">
                Nombre completo *
              </FieldLabel>
              <Input
                type="text"
                {...register("nombre")}
                placeholder="Ej: Juan Pérez"
                className={`bg-surface-container-low border-white/10 focus:border-primary ${validationErrors.nombre ? "border-destructive focus:border-destructive" : ""}`}
              />
              {validationErrors.nombre && (
                <FieldError>{validationErrors.nombre}</FieldError>
              )}
            </Field>

            {/* Edad y Género */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-muted-foreground">
                  Edad *
                </FieldLabel>
                <Input
                  type="number"
                  {...register("edad", { valueAsNumber: true })}
                  className={`bg-surface-container-low border-white/10 focus:border-primary ${validationErrors.edad ? "border-destructive focus:border-destructive" : ""}`}
                />
                {validationErrors.edad && (
                  <FieldError>{validationErrors.edad}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel className="text-muted-foreground">
                  Género *
                </FieldLabel>
                <Select
                  value={watch("genero")}
                  onValueChange={(value: "masculino" | "femenino" | "otro") => setValue("genero", value)}
                >
                  <SelectTrigger className={`bg-surface-container-low border-white/10 focus:border-primary ${validationErrors.genero ? "border-destructive focus:border-destructive" : ""}`}>
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-container border-white/10">
                    <SelectGroup>
                      <SelectItem value="masculino" className="focus:bg-surface-container-high focus:text-on-surface">Masculino</SelectItem>
                      <SelectItem value="femenino" className="focus:bg-surface-container-high focus:text-on-surface">Femenino</SelectItem>
                      <SelectItem value="otro" className="focus:bg-surface-container-high focus:text-on-surface">Otro</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {validationErrors.genero && (
                  <FieldError>{validationErrors.genero}</FieldError>
                )}
              </Field>
            </div>

            {/* Compras y Ticket */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-muted-foreground">
                  Compras por mes *
                </FieldLabel>
                <Input
                  type="number"
                  {...register("comprasPorMes", { valueAsNumber: true })}
                  className={`bg-surface-container-low border-white/10 focus:border-primary ${validationErrors.comprasPorMes ? "border-destructive focus:border-destructive" : ""}`}
                />
                {validationErrors.comprasPorMes && (
                  <FieldError>{validationErrors.comprasPorMes}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel className="text-muted-foreground">
                  Ticket promedio ($) *
                </FieldLabel>
                <Input
                  type="number"
                  {...register("ticketPromedio", { valueAsNumber: true })}
                  className={`bg-surface-container-low border-white/10 focus:border-primary ${validationErrors.ticketPromedio ? "border-destructive focus:border-destructive" : ""}`}
                />
                {validationErrors.ticketPromedio && (
                  <FieldError>{validationErrors.ticketPromedio}</FieldError>
                )}
              </Field>
            </div>

            {/* Sensible a descuentos */}
            <Field orientation="horizontal" className="flex items-center gap-3">
              <Checkbox
                id="descuentos"
                checked={sensibleADescuentos}
                onCheckedChange={(e) => setValue("sensibleADescuentos", !!e.valueOf())}
                className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <FieldLabel
                htmlFor="descuentos"
                className="text-muted-foreground mb-0"
              >
                Sensible a descuentos y promociones
              </FieldLabel>
            </Field>

            {/* Categorías */}
            <Field>
              <FieldLabel className="text-muted-foreground">
                Categorías de interés
              </FieldLabel>
              <Input
                type="text"
                {...register("categorias")}
                placeholder="Ej: tecnología, ropa, electrónica (separadas por coma)"
                className="bg-surface-container-low border-white/10 focus:border-primary"
              />
            </Field>

            {/* Historial */}
            <Field>
              <FieldLabel className="text-muted-foreground">
                Historial de comportamiento
              </FieldLabel>
              <Textarea
                {...register("historial")}
                placeholder="Ej: Compró zapatillas en enero&#10;Abandonó carrito de $5000&#10;Volvió con descuento"
                rows={4}
                className="bg-surface-container-low border-white/10 focus:border-primary resize-none"
              />
            </Field>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-primary to-primary-container hover:opacity-90 py-6 text-lg rounded-xl"
            >
              {loading ? <><Spinner className="mr-2" /> Creando...</> : <><Dna className="w-5 h-5 mr-2" /> Crear Clon</>}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
