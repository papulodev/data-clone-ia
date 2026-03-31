'use client';

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Clone, chatear } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, MessageCircle } from "lucide-react";
import { Input } from "./ui/input";

// Schema de validación para el mensaje
const messageSchema = z.object({
  mensaje: z.string().min(1, "El mensaje no puede estar vacío").max(500, "Máximo 500 caracteres"),
});

type MessageFormData = z.infer<typeof messageSchema>;

interface ChatViewProps {
  clone: Clone;
  onBack: () => void;
}

interface Message {
  role: "user" | "ia";
  content: string;
}

export function ChatView({ clone, onBack }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ia",
      content: `¡Hola! Soy ${clone.nombre}. ¿Querés preguntarme algo sobre mis preferencias como cliente?`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageFormData>({
    defaultValues: { mensaje: "" },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = async (data: MessageFormData) => {
    if (loading) return;

    // Validar con Zod
    const result = messageSchema.safeParse(data);
    if (!result.success) {
      setInputError(result.error.issues[0].message);
      return;
    }

    const userMessage = data.mensaje;
    reset(); // Limpiar input
    setInputError("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await chatear(clone._id, userMessage);
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "ia", content: res.respuesta }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ia", content: "Ups, hubo un error. Intentá de nuevo." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ia", content: "Error de conexión. Intentá de nuevo." },
      ]);
    }

    setLoading(false);
  };

  const quickQuestions = [
    "¿Me comprarías este producto?",
    "¿Te parece caro?",
    "¿Qué mejorarías?",
    "¿Esperarías una oferta?",
  ];

  const sendQuickQuestion = (question: string) => {
    if (loading) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    chatear(clone._id, question).then((res) => {
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "ia", content: res.respuesta }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ia", content: "Ups, hubo un error. Intentá de nuevo." },
        ]);
      }
      setLoading(false);
    });
  };

  return (
    <main className="p-10 h-[calc(100vh-4rem)] flex gap-8 flex-1">
      {/* Sidebar Info */}
      <section className="w-80 flex flex-col gap-6">
        <div className="glass-panel ghost-border p-8 rounded-xl flex flex-col items-center text-center relative overflow-hidden">
          <Button
            variant="outline"
            onClick={onBack}
            className="absolute top-4 left-4 border-white/20 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="relative mt-4">
            <div className="absolute inset-0 bg-secondary/20 blur-2xl rounded-full animate-pulse"></div>
            <div className="twin-avatar w-20 h-20 flex items-center justify-center bg-surface-container rounded-full animate-pulse-glow relative">
              <span className="text-2xl font-bold text-on-primary-fixed">
                {clone.nombre.charAt(0)}
              </span>
            </div>
          </div>

          <h2 className="font-bold text-lg text-on-surface mt-4">{clone.nombre}</h2>
          <p className="text-sm text-muted-foreground">
            {clone.edad} años • {clone.genero}
          </p>

          <div className="w-full space-y-3 mt-6">
            <div className="glass-panel border border-white/10 p-3 rounded-xl">
              <p className="text-xs text-muted-foreground">Ticket promedio</p>
              <p className="font-semibold text-on-surface">
                ${clone.ticketPromedio.toLocaleString()}
              </p>
            </div>
            <div className="glass-panel border border-white/10 p-3 rounded-xl">
              <p className="text-xs text-muted-foreground">Compras/mes</p>
              <p className="font-semibold text-on-surface">
                {clone.comprasPorMes}
              </p>
            </div>
            <div className="glass-panel border border-white/10 p-3 rounded-xl">
              <p className="text-xs text-muted-foreground">Descuentos</p>
              <p className="font-semibold text-on-surface">
                {clone.sensibleDescuentos ? "Sensible" : "Indiferente"}
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-auto pt-4">
            Simulación de IA • Groq
          </p>
        </div>
      </section>

      {/* Chat Area */}
      <section className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="pb-4 border-b border-white/5">
          <h1 className="font-manrope font-bold text-xl text-on-surface flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-primary" />
            Chat con {clone.nombre.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Conversá con el clon como si fuera un cliente real
          </p>
        </div>

        {/* Messages - grow and scroll */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-3 ${msg.role === "user"
                    ? "bg-gradient-to-br from-primary to-primary-container text-on-primary font-medium"
                    : "glass-panel border border-white/10 text-on-surface"
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="glass-panel border border-white/10 rounded-2xl px-5 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => sendQuickQuestion(q)}
                disabled={loading}
                className="shrink-0 px-3 py-1.5 rounded-full bg-surface-container-high text-muted-foreground text-sm hover:bg-surface-container-highest hover:text-on-surface transition-all disabled:opacity-50 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 pt-0 bg-surface/80 backdrop-blur-xl border-t border-white/5">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                {...register("mensaje")}
                placeholder="Escribí tu pregunta..."
                disabled={loading}
                className={`bg-surface-container-low border-white/10 focus:border-secondary ${inputError ? "border-destructive focus:border-destructive" : ""}`}
                onChange={(e) => {
                  // Limpiar error cuando el usuario empieza a escribir
                  if (inputError) setInputError("");
                  e.target.value = e.target.value;
                }}
              />
              {(errors.mensaje || inputError) && (
                <p className="text-destructive text-xs mt-1">
                  {errors.mensaje?.message || inputError}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="px-6 rounded-xl bg-gradient-to-r from-primary to-primary-container hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <span className="animate-spin">...</span>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
