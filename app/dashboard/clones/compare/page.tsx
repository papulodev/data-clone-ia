'use client';

import { useState } from "react";
import { Comparacion, compararClones } from "@/lib/api";
import CompareClonesForm from "@/components/forms/CompareClonesForm";
import CompareClonesResult from "@/components/CompareClonesResult";
import { SidebarTrigger } from "@/components/ui/sidebar";

function ComparePage() {

  const [comparacion, setComparacion] = useState<Comparacion | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCompareClone = async (dataClonA: string, dataClonB: string) => {
    const res = await compararClones(dataClonA, dataClonB);
    if (res.ok && res.comparacion) {
      setComparacion(res.comparacion);
    } else {
      setSubmitError(res.error || "Error al comparar");
    }
  }

  return (
    <main className="flex-1 h-full flex flex-col lg:flex-row gap-8 p-4 md:p-8">
      <SidebarTrigger size="icon-lg" />
      {/* Selector Section */}
      <section className="lg:w-96 flex flex-col gap-6">
        <h2 className="text-3xl font-manrope font-extrabold tracking-tighter text-white mb-6">Seleccionar Clones</h2>
        <CompareClonesForm
          onCompare={handleCompareClone}
          submitError={submitError}
          setSubmitError={setSubmitError}
        />
      </section>

      {/* Results */}
      <CompareClonesResult comparacion={comparacion} />
    </main>
  )
}

export default ComparePage