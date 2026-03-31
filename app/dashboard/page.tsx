'use client';

import { Suspense } from "react";
import { crearClonesMock } from "@/lib/api";
import { SidebarTrigger } from "@/components/ui/sidebar";
import BackgroundNebula from "@/components/BackgroundNebula";
import Loading from "./loading";
import { useCloneStore } from "@/store/useCloneStore";

export default function DashboardPage() {
  const clones = useCloneStore((state) => state.clones);
  const loading = useCloneStore((state) => state.loading);
  const fetchClones = useCloneStore((state) => state.fetchClones);

  const handleCrearMock = async () => {
    await crearClonesMock();
    fetchClones();
  };

  return (
    <Suspense fallback={<Loading />}>
      <SidebarTrigger size="icon-lg" />

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Cargando clones...</p>
          </div>
        </div>
      )}

      {!loading && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-xl">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-linear-to-br from-[#c5c0ff] to-[#68dbae] opacity-20 blur-3xl rounded-full" />
              <div className="relative">
                <span className="text-7xl">🧬</span>
              </div>
            </div>

            <h1 className="font-manrope font-bold text-4xl text-on-surface mb-4">
              Bienvenido a{" "}
              <span className="text-primary">DataClone AI</span>
            </h1>
            <p className="text-muted-foreground mb-8">
              Creá gemelos digitales de tus clientes para simular decisiones
              y predecir comportamiento.
            </p>

            {clones.length === 0 ? (
              <div>
                <p className="text-muted-foreground mb-4">
                  Comenzá creando tu primer clon o cargá los datos de demo.
                </p>
                <button
                  onClick={handleCrearMock}
                  className="px-6 py-3 bg-linear-to-r from-primary to-primary-container rounded-xl font-medium hover:opacity-90 transition-opacity cursor-pointer"
                >
                  🚀 Cargar Clones Demo
                </button>
              </div>
            ) : (
              <div>
                <p className="text-on-surface mb-2">
                  Tenés <span className="text-primary font-semibold">{clones.length}</span> clones creados.
                </p>
                <p className="text-muted-foreground">
                  Seleccioná un clon de la barra lateral para ver su perfil.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Suspense>
  );
}
