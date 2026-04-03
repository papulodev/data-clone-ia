import clsx from "clsx";
import { CircleChevronRight, Lightbulb, TrendingDown, TrendingUp } from "lucide-react";

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

function SimulationResultCard({ simulation }: { simulation: SimulationResult }) {
  const strokeDasharray = 502;
  let porcent = strokeDasharray * simulation.simulacion.score.valor / 100;
  let strokeDashoffset = strokeDasharray - porcent;

  let color = simulation.simulacion.score.color

  const customColorText = {
    "text-teal-300": color === "teal",
    "text-amber-300": color === "amber",
    "text-red-300": color === "red"
  }

  const customColorBg = {
    "bg-teal-300/10": color === "teal",
    "bg-amber-300/10": color === "amber",
    "bg-red-300/10": color === "red"
  }

  const customColorBorder = {
    "border-teal-300/30": color === "teal",
    "border-amber-300/30": color === "amber",
    "border-red-300/30": color === "red"
  }

  const customGradienBackground = {
    "bg-linear-to-r from-teal-300/10 to-transparent": color === "teal",
    "bg-linear-to-r from-amber-300/10 to-transparent": color === "amber",
    "bg-linear-to-r from-red-300/10 to-transparent": color === "red"
  }

  return (
    <div>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* <!-- Probabilidad Individual --> */}
        <div className="lg:col-span-12">
          <span className="text-sm uppercase tracking-[0.2em] text-outline font-bold">Escenario</span>
          <h2 className="text-2xl font-bold text-on-surface mb-4">{simulation.simulacion.escenario}</h2>
        </div>
        <div
          className="lg:col-span-4 glass-card p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center">
          <h3 className="text-xs uppercase tracking-[0.2em] text-outline mb-8 font-bold">Probabilidad Individual</h3>
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-white/5" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor"
                strokeWidth="12"></circle>
              {/* 25% = 502 * 0.25 = 125.5 (dashoffset = 502 - 125.5 = 376.5) */}
              <circle className={clsx("drop-shadow-[0_0_8px_rgba(255,180,171,0.5)]", customColorText)} cx="96" cy="96" fill="transparent"
                r="80" stroke="currentColor" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeWidth="12">
              </circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-on-surface tracking-tighter">
                {simulation.simulacion.score.valor}%
              </span>
              <span className={clsx("text-xs font-label font-bold uppercase", customColorText)}>
                {simulation.simulacion.score.nivel}
              </span>
            </div>
          </div>
          <div className={clsx("flex items-center gap-3 text-xs font-bold px-4 py-2 rounded-full mb-4", customColorBg, customColorText)}>
            <span className="opacity-60 font-medium text-on-surface-variant">
              Base: {simulation.simulacion.score.scoreBase}%
            </span>
            {simulation.simulacion.score.ajuste > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              Ajuste: {simulation.simulacion.score.ajuste}%
            </span>
          </div>
          <p className="text-sm text-on-surface-variant px-4">Aceptación estimada para Carlos López bajo este escenario.</p>
        </div>
        {/* <!-- Expected Behavior & Reasoning --> */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card p-8 rounded-3xl border border-white/5">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-sm uppercase tracking-[0.2em] text-outline font-bold">Comportamiento Esperado</h3>
              <span
                className={clsx("px-3 py-1 rounded-full border text-[10px] font-bold", customColorBg, customColorText, customColorBorder)}>ALERTA
                DE RETENCIÓN</span>
            </div>
            <div className="space-y-4">
              {simulation.simulacion.comportamientoEsperado.map((comportamiento, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                  <CircleChevronRight className="w-4 h-4 text-on-surface-variant" />
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {comportamiento}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/5">
              <h4 className="text-sm uppercase tracking-widest text-outline mb-3 font-bold">Razonamiento AI</h4>
              <p className="text-sm text-on-surface-variant italic leading-relaxed">
                "{simulation.simulacion.razonamiento}"
              </p>
            </div>
          </div>
          {/* Recommendation */}
          <div className={clsx("glass-card p-6 rounded-3xl border border-white/5", customGradienBackground)}>
            <div className="flex items-center gap-4">
              <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center p-2", customColorBg, customColorText)}>
                <Lightbulb className="w-7 h-7" />
              </div>
              <div>
                <p className={clsx("text-sm uppercase tracking-widest font-bold mb-1", customColorText)}>Recomendación Estratégica</p>
                <p className="text-on-surface font-semibold">
                  {simulation.simulacion.recomendacion}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SimulationResultCard;