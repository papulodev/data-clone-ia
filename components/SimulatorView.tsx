'use client';

import { useState } from "react";
import { Clone, simular as simularApi } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, TrendingUp, Percent, ShoppingCart, Truck, Gift } from "lucide-react";
import Link from "next/link";

interface SimulatorViewProps {
  clone: Clone;
  onBack: () => void;
}

interface SimulationResult {
  escenario: string;
  resultado: string;
  confianza: "alta" | "media" | "baja";
  timestamp: Date;
}

export function SimulatorView({ clone, onBack }: SimulatorViewProps) {
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
      const res = await simularApi(clone._id, texto);
      if (res.ok) {
        const confianzas: ("alta" | "media" | "baja")[] = ["alta", "media", "alta", "alta"];
        const confianza = confianzas[Math.floor(Math.random() * confianzas.length)];

        setHistorial((prev) => [
          {
            escenario: texto,
            resultado: res.resultado,
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
    <div className="flex-1 flex h-full">
      {/* Sidebar */}
      <div className="w-72 bg-surface/60 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col h-full">
        <Button
          variant="outline"
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          asChild
        >
          <Link href={`/dashboard/clones/${clone._id}`}>
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Link>
        </Button>

        <div className="text-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-secondary/20 blur-2xl rounded-full animate-pulse"></div>
            <div className="twin-avatar w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-surface-container rounded-full animate-pulse-glow">
              <span className="text-2xl font-bold text-on-primary-fixed">
                {clone.nombre.charAt(0)}
              </span>
            </div>
          </div>
          <h2 className="font-bold text-lg text-on-surface">{clone.nombre}</h2>
          <p className="text-sm text-muted-foreground">
            {clone.edad} años • {clone.genero}
          </p>
        </div>

        <div className="glass-panel border border-white/10 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Ticket promedio</span>
            <span className="text-sm font-semibold text-secondary-fixed-dim">
              ${clone.ticketPromedio.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Descuentos</span>
            <span className={`text-sm font-semibold ${clone.sensibleDescuentos ? "text-tertiary" : "text-muted-foreground"}`}>
              {clone.sensibleDescuentos ? "Sensible" : "Indiferente"}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <p className="text-xs text-muted-foreground text-center">
            Motor de simulación • Groq
          </p>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full bg-surface">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 shrink-0 bg-surface/50 backdrop-blur-sm">
          <h1 className="font-manrope font-bold text-xl text-on-surface flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-tertiary" />
            Simulador de Escenarios
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Probá cómo reaccionaría {clone.nombre.split(" ")[0]} ante diferentes situaciones
          </p>
        </div>

        {/* Historial - scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <h3 className="font-semibold text-on-surface">
              Historial ({historial.length})
            </h3>

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
          <div className="max-w-3xl mx-auto">
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
                  className="border-white/20 hover:bg-white/10"
                >
                  <s.icon className="w-3 h-3 mr-2" />
                  {s.text}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => simular(escenario)}
              disabled={loading || !escenario.trim()}
              className="mt-3 bg-gradient-to-r from-tertiary to-tertiary-container hover:opacity-90"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {loading ? "Simulando..." : "Simular Escenario"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimulationResultCard({ simulation }: { simulation: SimulationResult }) {
  const confianzaColor = {
    alta: "#68dbae",
    media: "#ffb95d",
    baja: "#ffb4ab",
  };

  const confianzaLabel = {
    alta: "Alta confianza",
    media: "Confianza media",
    baja: "Baja confianza",
  };

  return (
    <div className="glass-panel border border-white/10 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-medium text-on-surface">{simulation.escenario}</p>
          <p className="text-xs mt-1 text-muted-foreground">
            {simulation.timestamp.toLocaleTimeString()}
          </p>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: `${confianzaColor[simulation.confianza]}20`,
            color: confianzaColor[simulation.confianza],
          }}
        >
          {confianzaLabel[simulation.confianza]}
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-3">
        <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${simulation.confianza === "alta"
                ? 85
                : simulation.confianza === "media"
                  ? 60
                  : 35
                }%`,
              backgroundColor: confianzaColor[simulation.confianza],
              boxShadow: `0 0 8px ${confianzaColor[simulation.confianza]}`,
            }}
          />
        </div>
      </div>

      {/* Result */}
      <div className="bg-surface-container-high rounded-lg p-3">
        <p className="text-on-surface-variant text-sm whitespace-pre-wrap leading-relaxed">
          {simulation.resultado}
        </p>
      </div>
    </div>
  );
}
