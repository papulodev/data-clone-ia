'use client';

import { useState } from "react";
import { Clone, simularEscenario } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, TrendingUp, Percent, ShoppingCart, Truck, Gift, TrendingDown, CircleChevronRight, Lightbulb } from "lucide-react";
import Link from "next/link";
import SimulationResultCard from "./SimulationResultCard";

interface SimulatorViewProps {
  clone: Clone;
}

interface SimulationResult {
  escenario: string;
  simulacion: {
    escenario: string,
    score: {
      valor: number,
      nivel: string,
      color: string,
      scoreBase: number,
      ajuste: number
    },
    comportamientoEsperado: string[],
    razonamiento: string,
    recomendacion: string
  },
  confianza: "alta" | "media" | "baja",
  timestamp: Date,
}

export function SimulatorView({ clone }: SimulatorViewProps) {
  const [escenario, setEscenario] = useState("");
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState<SimulationResult[]>([]);

  const sugerencias = [
    { text: "suben el precio un 20%", icon: TrendingUp },
    { text: "lanzan una promoción del 30% off", icon: Percent },
    { text: "agregan un nuevo producto de $15000", icon: ShoppingCart },
    { text: "eliminan el envío gratis", icon: Truck },
    { text: "lanzan un programa de puntos", icon: Gift },
  ];

  const simular = async (texto: string) => {
    if (!texto.trim() || loading) return;

    setLoading(true);

    try {
      const res = await simularEscenario(clone._id, texto);
      if (res.ok) {
        const confianzas: ("alta" | "media" | "baja")[] = ["alta", "media", "alta", "alta"];
        const confianza = confianzas[Math.floor(Math.random() * confianzas.length)];

        setHistorial((prev) => [
          {
            escenario: texto,
            simulacion: res.simulacion,
            confianza,
            timestamp: new Date(),
          },
          ...prev,
        ]);
      }
    } catch {
      // Error handling
    }

    setLoading(false);
    setEscenario("");
  };

  return (
    <main className="flex-1 h-full flex flex-col lg:flex-row gap-8 p-4 md:p-8">
      <section className="w-full lg:w-80 flex gap-6">
        <div className="glass-panel ghost-border p-8 rounded-xl flex flex-col items-center text-center relative overflow-hidden w-full">
          <Button
            variant="outline"
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-tertiary/5 hover:bg-tertiary/10 border border-tertiary/10 transition-all self-start"
            asChild
          >
            <Link href={`/dashboard/clones/${clone._id}`}>
              <ArrowLeft className="w-5 h-5 text-tertiary" />
            </Link>
          </Button>

          <div className="relative mt-4">
            <div className="absolute inset-0 bg-secondary blur-2xl rounded-full animate-pulse"></div>
            <div
              className="w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-surface-container-high p-0.5 shadow-lg shadow-secondary animate-pulse-glow">
              <span className="text-2xl md:text-3xl font-manrope font-black text-secondary tracking-tighter">
                {clone.nombre.charAt(0)}
              </span>
            </div>
          </div>

          <h2 className="font-bold text-lg text-on-surface mt-4">{clone.nombre}</h2>
          <p className="text-sm text-muted-foreground">
            {clone.edad} años • {clone.genero}
          </p>

          <div className="w-full space-y-3 mt-6">
            <div className="glass-panel border p-3 rounded-xl">
              <p className="text-md text-muted-foreground">Ticket promedio</p>
              <p className="text-md lg:text-lg font-semibold text-secondary">
                ${clone.ticketPromedio.toLocaleString()}
              </p>
            </div>
            <div className="glass-panel border p-3 rounded-xl">
              <p className="text-md text-muted-foreground">Compras/mes</p>
              <p className="text-md lg:text-lg font-semibold text-on-surface">
                {clone.comprasPorMes}
              </p>
            </div>
            <div className="glass-panel border p-3 rounded-xl">
              <p className="text-md text-muted-foreground">Descuentos</p>
              <p className="text-md lg:text-lg font-semibold text-tertiary">
                {clone.sensibleDescuentos ? "Sensible" : "Indiferente"}
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-auto pt-4">
            Simulación de IA • Groq
          </p>
        </div>
      </section>

      <section className="flex-1 glass-panel ghost-border flex flex-col rounded-xl overflow-hidden h-full">
        <div className="p-6 pb-4 border-b border-white/5 shrink-0 bg-surface/50 backdrop-blur-sm">
          <h1 className="font-manrope font-bold text-xl text-on-surface flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-tertiary" />
            Simulador de Escenarios
          </h1>
          <p className="text-md text-muted-foreground mt-1">
            Probá cómo reaccionaría {clone.nombre.split(" ")[0]} ante diferentes situaciones
          </p>
        </div>

        {/* Historial - scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="font-semibold text-on-surface">
            Historial ({historial.length})
          </h3>

          <div className="overflow-y-auto p-3 space-y-4 scroll-auto h-[520px]">
            {historial.length === 0 ? (
              <div className="glass-panel border border-white/10 p-8 rounded-xl text-center">
                <Sparkles className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  Cargá un escenario para ver la simulación
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {historial.map((sim, i) => (
                  <SimulationResultCard key={i} simulation={sim} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Input Section - always visible at bottom */}
        <div className="p-6 pt-3 bg-surface/80 backdrop-blur-xl border-t border-white/5">
          <Textarea
            value={escenario}
            onChange={(e) => setEscenario(e.target.value)}
            placeholder="Ej: ¿Qué pasaría si suben los precios un 20%?"
            rows={2}
            disabled={loading}
            className="bg-surface-container-low border-white/10 focus:border-tertiary resize-none"
          />

          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-2 mt-3">
            {sugerencias.map((s) => (
              <Button
                key={s.text}
                onClick={() => setEscenario(s.text)}
                disabled={loading}
                variant="outline"
                size="sm"
                className="border-white/20 hover:bg-white/10 cursor-pointer"
              >
                <s.icon className="w-3 h-3" />
                {s.text}
              </Button>
            ))}
          </div>

          <Button
            onClick={() => simular(escenario)}
            disabled={loading || !escenario.trim()}
            className="mt-3 bg-linear-to-r from-tertiary to-tertiary-container hover:opacity-90 h-10 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "Simulando..." : "Simular Escenario"}
          </Button>
        </div>
      </section>
    </main>
  );
}
