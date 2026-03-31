import { Button } from "@/components/ui/button";
import { BotMessageSquare, BrainCog, Laugh, MessagesSquare, TrendingUp, TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="fixed top-[-10%] left-[-5%] w-[60vw] h-[60vw] nebula-purple pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] nebula-teal pointer-events-none z-0"></div>
      <nav className="sticky top-0 w-full z-100 bg-slate-950/30 backdrop-blur-md border-b border-white/5">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
          <div className="text-xl font-black tracking-tighter text-slate-50 font-headline">DataClone AI</div>

          <div className="flex items-center gap-6">
            <Button variant="link" asChild className="text-slate-400 text-md font-normal transition-all duration-300 font-manrope tracking-tight hover:text-slate-50">
              <Link href="/login">
                Iniciar sesión
              </Link>
            </Button>
            <Button asChild className="bg-indigo-200 text-md text-on-primary px-6 py-2.5 rounded-full font-manrope font-bold tracking-tight h-12">
              <Link href="/register">
                Registrarse
              </Link>
            </Button>
          </div>
        </div>
      </nav>
      <main className="relative z-10">
        <section
          className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-8 text-center pt-20 pb-32 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-8 border-primary/20">
            <span className="text-primary text-xs font-bold tracking-widest uppercase">✦ Hackathon CubePath 2026</span>
          </div>
          <h1
            className="text-6xl md:text-8xl font-headline font-extrabold tracking-tighter text-white mb-8 leading-[1.05]">
            Creá el <span className="gradient-text-pt">gemelo digital</span> de tus clientes
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-3xl mb-12 font-light leading-relaxed">
            Simulá decisiones, predecí comportamiento y chateá con clones IA de tus clientes — antes de ejecutar
            cualquier estrategia real.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Button asChild className="btn-primary-gradient text-on-primary px-10 py-5 rounded-full font-manrope font-bold text-lg shadow-[0_0_40px_rgba(140,132,235,0.3)] hover:opacity-90 transition-all cursor-pointer h-16">
              <Link href="/register">
                Empezar gratis
              </Link>
            </Button>
          </div>
        </section>
        <section className="max-w-7xl mx-auto px-8 py-40 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-10 rounded-[2rem] hover:scale-[1.02] transition-all duration-500 group">
            <div
              className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 group-hover:bg-primary/20 transition-colors">
              <BrainCog className="text-primary text-3xl" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-white mb-4">Gemelos digitales</h3>
            <p className="text-on-surface-variant leading-relaxed opacity-70">Modelos neuronales entrenados con data
              histórica para replicar patrones de consumo y preferencias individuales.</p>
          </div>
          <div className="glass-card p-10 rounded-[2rem] hover:scale-[1.02] transition-all duration-500 group">
            <div
              className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-8 border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
              <MessagesSquare className="text-secondary text-3xl" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-white mb-4">Chat en personaje</h3>
            <p className="text-on-surface-variant leading-relaxed opacity-70">Intercambiá ideas con tus segmentos.
              Validá copys, ofertas y nuevas funcionalidades en una conversación natural.</p>
          </div>
          <div className="glass-card p-10 rounded-[2rem] hover:scale-[1.02] transition-all duration-500 group">
            <div
              className="w-14 h-14 rounded-2xl bg-tertiary/10 flex items-center justify-center mb-8 border border-tertiary/20 group-hover:bg-tertiary/20 transition-colors">
              <BotMessageSquare className="text-tertiary text-3xl" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-white mb-4">Simulador de decisiones</h3>
            <p className="text-on-surface-variant leading-relaxed opacity-70">Ejecutá A/B testing virtual en segundos.
              Predecí el churn y la tasa de conversión con una precisión del 94%.</p>
          </div>
        </section>
        <section className="max-w-7xl mx-auto px-8 py-40">
          <div className="relative group">
            <div
              className="absolute -inset-4 bg-linear-to-r from-primary/20 to-secondary/20 rounded-[2.5rem] blur-3xl opacity-50 group-hover:opacity-70 transition-opacity">
            </div>
            <div className="relative glass-card rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
              <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-6 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/40"></div>
                <div className="ml-4 h-6 w-1/3 bg-white/5 rounded-full"></div>
              </div>
              <div className="p-12 flex flex-col md:flex-row gap-12 items-center">
                <div
                  className="w-full md:w-80 glass-card bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                  <div
                    className="w-24 h-24 mx-auto rounded-full bg-primary-container/20 border-2 border-primary flex items-center justify-center mb-6 relative">
                    <span className="text-3xl font-headline font-bold text-primary">MG</span>
                    <div
                      className="absolute bottom-1 right-1 w-6 h-6 bg-secondary rounded-full border-4 border-[#1c1f29] animate-pulse">
                    </div>
                  </div>
                  <h4 className="text-2xl font-headline font-bold text-white mb-1">María García</h4>
                  <p className="text-outline text-sm mb-8">Segmento: High-LTV Power User</p>
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-surface-container-high py-3 rounded-xl">
                      <p className="text-[10px] text-outline uppercase font-bold tracking-tighter">Fidelidad
                      </p>
                      <p className="text-secondary font-bold">98%</p>
                    </div>
                    <div className="bg-surface-container-high py-3 rounded-xl">
                      <p className="text-[10px] text-outline uppercase font-bold tracking-tighter">Apetito</p>
                      <p className="text-tertiary font-bold">Alta</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button
                      className="w-full py-3 rounded-xl btn-primary-gradient text-on-primary font-bold text-sm">Chatear</button>
                    <button
                      className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-sm transition-colors">Simular</button>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-10">
                  <div className="flex flex-wrap gap-4">
                    <div
                      className="px-6 py-3 rounded-full bg-surface-container-highest/50 border border-white/5 flex items-center gap-3">
                      <Laugh className="text-primary" />
                      <span className="text-sm font-medium">Sentimiento: Positivo</span>
                    </div>
                    <div
                      className="px-6 py-3 rounded-full bg-surface-container-highest/50 border border-white/5 flex items-center gap-3">
                      <TrendingUp className="text-secondary" />
                      <span className="text-sm font-medium">Prob. Compra: 84%</span>
                    </div>
                    <div
                      className="px-6 py-3 rounded-full bg-surface-container-highest/50 border border-white/5 flex items-center gap-3">
                      <TriangleAlert className="text-tertiary" />
                      <span className="text-sm font-medium">Riesgo Churn: 2%</span>
                    </div>
                  </div>
                  <div
                    className="aspect-video w-full glass-card bg-white/5 rounded-3xl p-8 relative overflow-hidden flex items-center justify-center">
                    <img className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
                      data-alt="Futuristic data dashboard showing glowing data visualization lines and radar chart in deep neon purple and teal colors"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJJpYZXIwJzfvJ-3vl4GAKHvKRgENwaO1xcvb0cdZmXGDnGOhWs3QSXEx45ZchleOQdhrmnJbrgBx5_wmVnMy2tY4rW5J6Z0Ht73UM8yodt2XU-5l5EXb-nhnqCFM0Lb0DwW_YEoRAI2J1YlUJh_gFmuJkDkWd_MKHXOX7hFiGMt70QYs23i9LuheaBdOSyS0PnxnMPmLvEQ_D6qBIkS5wP2ijbRmOKbsUBl9jvRjlv6Hdqxm7bYe6036oNSWrSNRULFBRkxYNvw" />
                    <div className="relative z-10 w-full max-w-sm space-y-6">
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[84%] shadow-[0_0_15px_#68dbae]"></div>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[65%] shadow-[0_0_15px_#c5c0ff]"></div>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-tertiary w-[30%] shadow-[0_0_15px_#ffb95d]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-[#10131c] mt-40 border-t border-white/5 w-full pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-center items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-lg font-bold text-slate-200 font-manrope text-center">DataClone AI</div>
            <p className="font-['Inter'] text-sm tracking-wide text-slate-500 opacity-70 text-center">© 2026 DataClone AI. Built for
              Matias Ortega.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
