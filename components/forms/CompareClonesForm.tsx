'use client';
import { CompareFormData, compareSchema } from '@/lib/schemas/clone';
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowDown, Scale } from "lucide-react";
import { useCloneStore } from '@/store/useCloneStore';

interface CompareClonesFormProps {
  onCompare: (dataClonA: string, dataClonB: string) => void;
  submitError: string | null;
  setSubmitError: (error: string | null) => void;
}

function CompareClonesForm({ onCompare, submitError, setSubmitError }: CompareClonesFormProps) {
  const clones = useCloneStore((state) => state.clones);
  const [loading, setLoading] = useState(false);

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

    await onCompare(data.clonA, data.clonB);

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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4 space-y-4">
      <Field>
        <FieldLabel className="text-muted-foreground">
          Primer clon *
        </FieldLabel>
        <Select value={clonAId} onValueChange={handleClonAChange}>
          <SelectTrigger className={`bg-surface-container-low border-white/10 focus:border-primary ${errors.clonA ? "border-destructive focus:border-destructive" : ""}`}>
            <SelectValue placeholder="Seleccionar Clone" />
          </SelectTrigger>
          <SelectContent className="bg-surface-container">
            <SelectGroup>
              <SelectLabel>Clones</SelectLabel>
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
          <SelectTrigger className={`bg-surface-container-low focus:border-primary ${errors.clonB ? "border-destructive focus:border-destructive" : ""}`}>
            <SelectValue placeholder="Seleccionar Clone" />
          </SelectTrigger>
          <SelectContent className="bg-surface-container border-white/10">
            <SelectGroup>
              <SelectLabel>Clones</SelectLabel>
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
  )
}

export default CompareClonesForm