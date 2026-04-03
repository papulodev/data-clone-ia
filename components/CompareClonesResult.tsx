import clsx from "clsx";
import { Award, Cable, CircleDollarSign, File, Lightbulb, RefreshCcw, Scale, Trophy, UnfoldHorizontal } from "lucide-react";
import { Comparacion } from '@/lib/api'

function CompareClonesResult({ comparacion }: { comparacion: Comparacion | null }) {
  return (
    <section className="flex-1 flex flex-col gap-4 overflow-y-auto p-4">
      <header className="flex flex-col justify-between">
        <span className="text-secondary font-manrope font-bold tracking-[0.2em] text-xs uppercase mb-4 block">DataClone
          AI</span>
        <h2 className="text-3xl font-manrope font-extrabold tracking-tighter text-white mb-6">Análisis Comparativo</h2>
        <p className="text-on-surface-variant text-lg leading-relaxed">Exploración profunda de divergencias neuronales y patrones de comportamiento entre entidades clonadas.</p>
      </header>

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
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
            {/* Profile A */}
            <div className="glass-panel p-8 rounded-[2rem] relative group hover:scale-[1.02] transition-all duration-500">
              <div
                className="absolute -top-4 -left-4 px-4 py-1 bg-primary text-on-primary text-[10px] font-bold rounded-full uppercase tracking-tighter">
                Clon A</div>
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full border-2 border-primary/40 p-1 mb-6 relative">
                  <div
                    className="w-full h-full rounded-full bg-surface-container-lowest flex items-center justify-center overflow-hidden">
                    <span className="text-4xl md:text-5xl font-manrope font-black text-primary tracking-tighter">
                      {comparacion.clonA.nombre.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></div>
                </div>
                <h2 className="text-3xl font-manrope font-bold text-white mb-2">
                  {comparacion.clonA.nombre}
                </h2>
              </div>
            </div>
            {/* Similarity Bar (Central) */}
            <div className="flex flex-col items-center py-8">
              <div
                className="h-64 w-4 bg-surface-container-high rounded-full relative overflow-hidden flex flex-col justify-end">
                <div className={`h-[${comparacion.similitud.porcentaje}%] ${clsx("w-full", {
                  "bg-tertiary": comparacion.similitud.porcentaje > 70,
                  "bg-secondary": comparacion.similitud.porcentaje > 40 && comparacion.similitud.porcentaje <= 70,
                  "bg-primary": comparacion.similitud.porcentaje <= 40,
                })}`}></div>
                <div className="absolute inset-0 bg-linear-to-t from-tertiary/20 to-transparent"></div>
              </div>
              <div className="mt-6 text-center">
                <div className="text-4xl font-manrope font-extrabold text-tertiary mb-1">
                  {comparacion.similitud.porcentaje}%
                </div>
                <p className="text-[10px] text-outline font-bold uppercase tracking-[0.2em] mb-4">
                  Similitud
                </p>
                <div
                  className="px-3 py-1 bg-tertiary/10 border border-tertiary/30 rounded-full text-tertiary text-[10px] font-bold uppercase">
                  {comparacion.similitud.nivel}
                </div>
              </div>
            </div>
            {/* Profile B */}
            <div className="glass-panel p-8 rounded-[2rem] relative group hover:scale-[1.02] transition-all duration-500">
              <div
                className="absolute -top-4 -right-4 px-4 py-1 bg-secondary text-on-secondary text-[10px] font-bold rounded-full uppercase tracking-tighter text-right">
                Clon B</div>
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full border-2 border-secondary/40 p-1 mb-6 relative">
                  <div
                    className="w-full h-full rounded-full bg-surface-container-lowest flex items-center justify-center overflow-hidden">
                    <span className="text-4xl md:text-5xl font-manrope font-black text-secondary tracking-tighter">
                      {comparacion.clonB.nombre.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-secondary/20 animate-pulse"></div>
                </div>
                <h2 className="text-3xl font-manrope font-bold text-white mb-2">
                  {comparacion.clonB.nombre}
                </h2>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="glass-panel p-8 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-3">
              <File className="w-5 h-5 text-error" />
              <h3 className="text-xl font-headline font-bold text-white">Resumen</h3>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {comparacion.analisis.resumen}
            </p>
          </div>

          {/* Similitudes */}
          {comparacion.analisis.similitudes.length > 0 && (
            <div className="glass-panel p-8 rounded-[2rem]">
              <div className="flex items-center gap-3 mb-3">
                <Cable className="w-5 h-5 text-secondary" />
                <h3 className="text-xl font-headline font-bold text-white">Similitudes</h3>
              </div>
              <ul className="space-y-2">
                {comparacion.analisis.similitudes.map((s, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
                    <p className="text-sm text-on-surface-variant leading-relaxed">{s}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Diferencias */}
          {comparacion.analisis.diferencias.length > 0 && (
            <div className="glass-panel p-8 rounded-[2rem]">
              <div className="flex items-center gap-3 mb-3">
                <UnfoldHorizontal className="w-5 h-5 text-tertiary" />
                <h3 className="text-xl font-headline font-bold text-white">Diferencias</h3>
              </div>
              <ul className="space-y-2">
                {comparacion.analisis.diferencias.map((d, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2" />
                    <p className="text-sm text-on-surface-variant leading-relaxed">{d}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recomendación Estratégica */}
          <div className="glass-panel p-8 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-3">
              <Lightbulb className="w-5 h-5 text-primary-fixed-dim" />
              <h3 className="text-xl font-headline font-bold text-white">Recomendación Estratégica</h3>
            </div>
            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20">
              <p className="text-on-surface-variant leading-relaxed">
                {comparacion.analisis.recomendacion}
              </p>
            </div>
          </div>

          {/* Ganadores de Badges */}
          <div className="glass-panel p-8 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-5 h-5 text-primary-fixed-dim" />
              <h3 className="text-xl font-headline font-bold text-white">Ganadores de Badges</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-secondary" />
                  <span className="text-sm text-white/70">Ganador Descuentos</span>
                </div>
                <span className="text-sm font-bold text-secondary">{comparacion.analisis.ganadorDescuentos}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-tertiary/5 border border-tertiary/10">
                <div className="flex items-center gap-3">
                  <CircleDollarSign className="w-5 h-5 text-tertiary" />
                  <span className="text-sm text-white/70">Ganador Ticket</span>
                </div>
                <span className="text-sm font-bold text-tertiary">{comparacion.analisis.ganadorTicket}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                <div className="flex items-center gap-3">
                  <RefreshCcw className="w-5 h-5 text-secondary" />
                  <span className="text-sm text-white/70">Ganador Frecuencia</span>
                </div>
                <span className="text-sm font-bold text-secondary">{comparacion.analisis.ganadorFrecuencia}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default CompareClonesResult