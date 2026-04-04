'use client';

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Clone, chatear, obtenerHistorial, borrarHistorial } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, MessageCircle, Bot, User, Trash2 } from "lucide-react";
import Link from "next/link";
import { Field, FieldDescription } from "./ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { toast } from "sonner";

// Schema de validación para el mensaje
const messageSchema = z.object({
  mensaje: z.string().min(1, "El mensaje no puede estar vacío").max(500, "Máximo 500 caracteres"),
});

type MessageFormData = z.infer<typeof messageSchema>;

interface ChatViewProps {
  clone: Clone;
}

interface Message {
  role: "user" | "ia";
  content: string;
}

export function ChatView({ clone }: ChatViewProps) {
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState<string>("");
  const [historialCargado, setHistorialCargado] = useState(false);
  const [conversacionId, setConversacionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mensaje de bienvenida inicial
  const mensajeBienvenida: Message = {
    role: "ia",
    content: `¡Hola! Soy ${clone.nombre}. ¿Querés preguntarme algo sobre mis preferencias como cliente?`,
  };

  const [messages, setMessages] = useState<Message[]>([mensajeBienvenida]);

  useEffect(() => {
    const cargarHistorial = async () => {
      const res = await obtenerHistorial(clone._id)
      if (res.ok && res.mensajes && res.mensajes.length > 0) {
        const msgs: Message[] = res.mensajes.map((m: any) => ({
          role: (m.role === 'user' ? 'user' : 'ia') as "user" | "ia",
          content: m.content
        }))
        // Reemplazar todo el estado con el historial + mensaje de bienvenida
        setMessages([...msgs, mensajeBienvenida])
        // Guardar el conversacionId si viene
        if (res.conversacionId) {
          setConversacionId(res.conversacionId)
        }
      }
      setHistorialCargado(true)
    }
    cargarHistorial()
  }, [clone._id])

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
      const res = await chatear(clone._id, userMessage, conversacionId || undefined);
      console.log("Respuesta:", res);
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "ia", content: res.respuesta }]);
        // Guardar el conversacionId si viene en la respuesta
        if (res.conversacionId && !conversacionId) {
          setConversacionId(res.conversacionId)
        }
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
    "¿Qué te haría decidir comprar algo hoy?",
    "¿Cómo evaluás si algo vale lo que cuesta?",
    "¿Por dónde preferís comprar: online o en tienda?",
    "¿Qué te haría abandonar una compra?",
  ];

  const sendQuickQuestion = (question: string) => {
    if (loading) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    chatear(clone._id, question, conversacionId || undefined).then((res) => {
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "ia", content: res.respuesta }]);
        if (res.conversacionId && !conversacionId) {
          setConversacionId(res.conversacionId)
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ia", content: "Ups, hubo un error. Intentá de nuevo." },
        ]);
      }
      setLoading(false);
    });
  };

  const handleBorrarHistorial = async () => {
    if (!confirm("¿Querés borrar todo el historial de chat?")) return;
    const res = await borrarHistorial(clone._id);
    if (res.ok) {
      toast.success("Historial borrado correctamente");
      setMessages([
        {
          role: "ia",
          content: `¡Hola! Soy ${clone.nombre}. ¿Querés preguntarme algo sobre mis preferencias como cliente?`,
        },
      ]);
    }
  };

  return (
    <main className="flex-1 h-full flex flex-col lg:flex-row gap-8 p-4 md:p-8">
      {/* Sidebar Info */}
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

      {/* Chat Area */}
      <section className="flex-1 glass-panel ghost-border flex flex-col rounded-xl overflow-hidden h-full">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 shrink-0 bg-surface/50 backdrop-blur-sm flex justify-between items-start">
          <div>
            <h1 className="font-manrope font-bold text-xl text-on-surface flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-tertiary" />
              Chat con {clone.nombre.split(" ")[0]}
            </h1>
            <p className="text-md text-muted-foreground mt-1">
              Conversá con el clon como si fuera un cliente real
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={handleBorrarHistorial}
                className="bg-red-500 text-white hover:bg-red-600 p-2 cursor-pointer rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Borrar historial</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Messages - grow and scroll */}
        <div className="overflow-y-auto p-6 space-y-4 scroll-auto h-[680px]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 items-start ${msg.role === "user" ? "flex-row-reverse self-end" : "justify-start"}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-high p-0.5 border border-tertiary">
                  <span className="text-xl font-manrope font-black text-secondary tracking-tighter">
                    {msg.role === "user" ? (
                      <User className="w-5 h-5 text-tertiary" />
                    ) : (
                      <Bot className="w-5 h-5 text-tertiary" />
                    )}
                  </span>
                </div>
              </div>
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-3 ${msg.role === "user"
                  ? "bg-linear-to-br from-primary to-primary-container text-on-primary font-medium"
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
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto pt-2">
            {quickQuestions.map((q) => (
              <Button
                key={q}
                onClick={() => sendQuickQuestion(q)}
                disabled={loading}
                className="shrink-0 px-3 py-1.5 rounded-full bg-surface-container-high text-muted-foreground text-sm hover:bg-surface-container-highest hover:text-on-surface transition-all disabled:opacity-50 cursor-pointer"
              >
                {q}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 pb-4 border-b border-white/5 shrink-0 bg-surface/50 backdrop-blur-sm">
          <div className="flex gap-3">
            <Field className="flex-1">
              <InputGroup className="h-14 bg-surface-container rounded-xl border-white/10">
                <InputGroupInput
                  {...register("mensaje")}
                  placeholder="Escribí tu pregunta..."
                  disabled={loading}
                  className={`focus:border-secondary ${inputError ? "border-destructive focus:border-destructive" : ""}`}
                  onChange={(e) => {
                    // Limpiar error cuando el usuario empieza a escribir
                    if (inputError) setInputError("");
                    e.target.value = e.target.value;
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-12 rounded-xl bg-secondary hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {loading ? (
                      <span className="animate-spin">...</span>
                    ) : (
                      <Send />
                    )}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription className="text-destructive text-xs mt-1">
                {(errors.mensaje || inputError) && (
                  errors.mensaje?.message || inputError
                )}
              </FieldDescription>
            </Field>
          </div>
        </form>
      </section>
    </main>
  );
}
