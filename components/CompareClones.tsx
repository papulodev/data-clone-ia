'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Clone, Comparacion, compararClones } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowDown, Check, Scale } from "lucide-react";
import { Field, FieldLabel, FieldError } from "./ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Spinner } from "./ui/spinner";
import { CompareFormData, compareSchema } from "@/lib/schemas/clone";

// Schema de validación para la comparación

interface CompareClonesProps {
  clones: Clone[];
}

export function CompareClones({ clones }: CompareClonesProps) {
  const [comparacion, setComparacion] = useState<Comparacion | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<CompareFormData>({
    defaultValues: {
      clonA: "",
      clonB: "",
    },
  });

  const clonAId = watch("clonA");
  const clonBId = watch("clonB");

  const onSubmit = async (data: CompareFormData) => {
    // Validar que sean diferentes con Zod
    const result = compareSchema.safeParse(data);

    if (!result.success) {
      const issue = result.error.issues[0];
      const field = issue.path[0] as "clonA" | "clonB";
      setError(field, { message: issue.message });
      return;
    }

    setSubmitError(null);
    setLoading(true);

    try {
      const res = await compararClones(data.clonA, data.clonB);
      if (res.ok && res.comparacion) {
        setComparacion(res.comparacion);
      } else {
        setSubmitError(res.error || "Error al comparar");
      }
    } catch {
      setSubmitError("Error de conexión");
    }

    setLoading(false);
  };

  // Cuando cambia el valor del select, limpiar el error
  const handleClonAChange = (value: string) => {
    setValue("clonA", value);
    clearErrors("clonA");
  };

  const handleClonBChange = (value: string) => {
    setValue("clonB", value);
    clearErrors("clonB");
    // Verificar si son iguales y mostrar error
    if (value === clonAId) {
      setError("clonB", { message: "Los clones deben ser diferentes" });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Selector Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
        <Field>
          <FieldLabel className="text-muted-foreground">
            Primer clon *
          </FieldLabel>
          <Select value={clonAId} onValueChange={handleClonAChange}>
            <SelectTrigger className={`bg-surface-container-low border-white/10 focus:border-primary ${errors.clonA ? "border-destructive focus:border-destructive" : ""}`}>
              <SelectValue placeholder="Seleccionar clon" />
            </SelectTrigger>
            <SelectContent className="bg-surface-container border-white/10">
              <SelectGroup>
                {clones.map((c) => (
                  <SelectItem
                    key={c._id}
                    value={c._id}
                    className="focus:bg-surface-container-high focus:text-on-surface"
                    disabled={c._id === clonBId}
                  >
                    {c.nombre}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.clonA && <FieldError>{errors.clonA.message}</FieldError>}
        </Field>

        <div className="flex justify-center">
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </div>

        <Field>
          <FieldLabel className="text-muted-foreground">
            Segundo clon *
          </FieldLabel>
          <Select value={clonBId} onValueChange={handleClonBChange}>
            <SelectTrigger className={`bg-surface-container-low border-white/10 focus:border-primary ${errors.clonB ? "border-destructive focus:border-destructive" : ""}`}>
              <SelectValue placeholder="Seleccionar clon" />
            </SelectTrigger>
            <SelectContent className="bg-surface-container border-white/10">
              <SelectGroup>
                {clones
                  .filter((c) => c._id !== clonAId)
                  .map((c) => (
                    <SelectItem
                      key={c._id}
                      value={c._id}
                      className="focus:bg-surface-container-high focus:text-on-surface"
                    >
                      {c.nombre}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.clonB && <FieldError>{errors.clonB.message}</FieldError>}
        </Field>

        <Button
          type="submit"
          disabled={loading || !clonAId || !clonBId}
          className="w-full bg-linear-to-r from-primary to-primary-container hover:opacity-90 cursor-pointer h-10 text-md"
        >
          {loading ? <><Spinner className="mr-2" /> Comparando...</> : <><Scale className="w-4 h-4" /> Comparar</>}
        </Button>

        {submitError && (
          <p className="text-destructive text-sm text-center">{submitError}</p>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Embeddings BGE-M3
        </p>
      </form>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {!comparacion ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center glass-panel border border-white/10 p-8 rounded-xl">
              <Scale className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                Seleccioná dos clones y presioná comparar
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Porcentaje de similitud */}
            <div className="glass-panel border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `linear-gradient(135deg, ${comparacion.similitud.porcentaje > 70
                    ? "#68dbae"
                    : comparacion.similitud.porcentaje > 40
                      ? "#ffb95d"
                      : "#ffb4ab"
                    } 0%, transparent 100%)`,
                }}
              />

              <div className="relative">
                <p className="text-muted-foreground mb-2">Similitud</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span
                    className="text-5xl font-bold"
                    style={{
                      color:
                        comparacion.similitud.porcentaje > 70
                          ? "#68dbae"
                          : comparacion.similitud.porcentaje > 40
                            ? "#ffb95d"
                            : "#ffb4ab",
                      textShadow: `0 0 30px ${comparacion.similitud.porcentaje > 70
                        ? "rgba(104, 219, 174, 0.5)"
                        : comparacion.similitud.porcentaje > 40
                          ? "rgba(255, 185, 93, 0.5)"
                          : "rgba(255, 180, 171, 0.5)"
                        }`,
                    }}
                  >
                    {comparacion.similitud.porcentaje}%
                  </span>
                </div>
                <p className="text-on-surface">
                  {comparacion.clonA.nombre} vs {comparacion.clonB.nombre}
                </p>
              </div>
            </div>

            {/* Similitudes */}
            {comparacion.analisis.similitudes.length > 0 && (
              <div className="glass-panel border border-white/10 rounded-2xl p-6">
                <h3 className="text-on-surface font-semibold flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-secondary" /> Similitudes
                </h3>
                <div className="space-y-2">
                  {comparacion.analisis.similitudes.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
                      <p className="text-muted-foreground text-sm">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Diferencias */}
            {comparacion.analisis.diferencias.length > 0 && (
              <div className="glass-panel border border-white/10 rounded-2xl p-6">
                <h3 className="text-on-surface font-semibold flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-tertiary" /> Diferencias
                </h3>
                <div className="space-y-2">
                  {comparacion.analisis.diferencias.map((d, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2" />
                      <p className="text-muted-foreground text-sm">{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
