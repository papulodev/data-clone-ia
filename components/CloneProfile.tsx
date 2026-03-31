'use client';

import { Clone } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, ShoppingCart, DollarSign, Tag, Bot, Sparkles } from "lucide-react";
import Link from "next/link";

interface CloneProfileProps {
  clone: Clone;
}

export function CloneProfile({ clone }: CloneProfileProps) {
  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          asChild
        >
          <Link href="/dashboard">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Link>
        </Button>
        <h1 className="font-manrope font-bold text-2xl text-on-surface">
          Perfil del Clon
        </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Hero Card */}
        <div className="glass-panel ghost-border rounded-2xl p-8 md:p-12 group shadow-[0_40px_60px_-5px_rgba(42,28,132,0.05)] relative overflow-hidden">
          {/* Background Glow */}
          <div
            className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-colors duration-700">
          </div>

          <div className="relative flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center bg-linear-to-br from-primary to-primary-container p-[2px] shadow-lg shadow-primary/20">
                <div
                  className="w-full h-full rounded-full bg-surface-container-lowest flex items-center justify-center overflow-hidden">
                  <span className="text-4xl md:text-5xl font-manrope font-black text-primary tracking-tighter">
                    {clone.nombre.charAt(0)}
                  </span>
                </div>
              </div>
              {/* Status Badge */}
              <Badge className="absolute -bottom-1 -right-1 bg-[#68dbae] text-[#002115] text-xs font-semibold px-2 py-0.5 rounded-full border-0">
                Activo
              </Badge>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-manrope font-extrabold tracking-tighter text-on-surface">
                {clone.nombre}
              </h2>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 rounded-lg bg-white/5 ghost-border text-sm font-label text-on-surface-variant">
                  {clone.edad} años
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/5 ghost-border text-sm font-label text-on-surface-variant">
                  {clone.genero}
                </span>
              </div>

              {/* Personality Summary */}
              <p className="text-lg italic font-body text-on-surface-variant leading-relaxed opacity-90">
                "{clone.resumenPersonalidad}"
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={ShoppingCart}
            label="Compras por mes"
            value={clone.comprasPorMes.toString()}
            color="#c5c0ff"
          />
          <StatCard
            icon={DollarSign}
            label="Ticket promedio"
            value={`$${clone.ticketPromedio.toLocaleString()}`}
            color="#68dbae"
          />
          <StatCard
            icon={Tag}
            label="Sensible a descuentos"
            value={clone.sensibleDescuentos ? "Sí" : "No"}
            color="#ffb95d"
          />
        </div>

        {/* Categories */}
        <div className="bg-white/6 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold text-on-surface mb-4">Categorías de interés</h3>
          <div className="flex flex-wrap gap-2">
            {clone.categorias.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-label border border-secondary/20"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Historial */}
        <div className="bg-white/6 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold text-on-surface mb-4">Historial de comportamiento</h3>
          <div className="space-y-3">
            {clone.historial.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#68dbae] mt-2" />
                <p className="text-[#c8c4d4]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button asChild className="flex-1 text-lg bg-linear-to-r from-primary to-primary-container hover:opacity-90 rounded-full px-2 py-6 shadow-lg shadow-primary/20 cursor-pointer">
            <Link href={`/dashboard/clones/${clone._id}/chat`}>
              <MessageCircle className="w-5 h-5 mr-2" />
              Chatear con {clone.nombre.split(" ")[0]}
            </Link>
          </Button>
          <Button asChild className="flex-1 text-lg bg-linear-to-r from-tertiary to-tertiary-container hover:opacity-90 rounded-full px-2 py-6 shadow-lg shadow-tertiary/20 cursor-pointer">
            <Link href={`/dashboard/clones/${clone._id}/simulate`}>
              <Sparkles className="w-5 h-5 mr-2" />
              Simular Decision
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="glass-panel ghost-border rounded-2xl p-6 flex flex-col justify-between items-center hover:scale-[1.02] transition-transform duration-300">
      <div
        className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <p className="text-[10px] font-label text-outline uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-manrope font-bold text-on-surface">{value}</p>
    </div>
  );
}
