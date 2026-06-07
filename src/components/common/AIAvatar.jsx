import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useLms511 } from "../../hooks/useLms511";
import { usePlatform } from "../../context/PlatformContext";
import MiningRobotAvatar from "./MiningRobotAvatar";

const GREETING_BUBBLE_DURATION_MS = 12000;

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

function buildSystemInstruction(latest, history, isDemoMode = false) {
  const now = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });

  const sensorBlock = latest
    ? `## Estado actual del sensor (${latest.host} · ${latest.site})
- Flujo volumétrico: ${latest.flow_m3_h?.toFixed(2)} m³/h (${latest.flow_m3_s?.toFixed(4)} m³/s)
- Velocidad de cinta: ${latest.belt_speed_mps?.toFixed(2)} m/s
- Volumen acumulado hoy: ${latest.volume_day_m3?.toFixed(1)} m³
- Puntos válidos en última muestra: ${latest.valid_points ?? "—"}
- Última medición del sensor: ${latest.source_created_at ? new Date(latest.source_created_at).toLocaleString("es-CL") : "—"}
- Datos actualizados en plataforma: ${latest.updated_at ? new Date(latest.updated_at).toLocaleString("es-CL") : "—"}`
    : "## Estado del sensor\nSin datos en vivo disponibles actualmente.";

  const historyBlock = history?.length
    ? `## Histórico reciente (últimos períodos)\n${history.map(r =>
        `- ${r.bucket_label}: ${r.volume_m3?.toFixed(1)} m³ · flujo promedio ${r.avg_flow_m3_h?.toFixed(2)} m³/h`
      ).join("\n")}`
    : "## Histórico\nSin datos históricos disponibles actualmente.";

  return `Eres AR-I-2 (se pronuncia 'Ar-I-Dos'), asistente de IA integrado en la plataforma industrial Ingeglobal.
Fecha y hora actual: ${now}

Responde de forma breve y profesional, usando viñetas y negritas para destacar lo importante.
Basa tus respuestas EXCLUSIVAMENTE en los datos en tiempo real que se te proporcionan abajo.
Si no hay datos disponibles para una pregunta, dilo claramente — nunca inventes cifras.
Si te preguntan algo fuera del ámbito operacional de la plataforma, responde amablemente que solo puedes ayudar con eso.

## Reglas estrictas sobre datos
Si te preguntan por una fecha, período, sensor o métrica que NO aparece explícitamente en los bloques de datos de abajo, responde literalmente: "No tengo ese dato disponible en este momento." NO interpoles, NO extrapoles, NO estimes, NO uses "aproximadamente". Es preferible decir que no tienes el dato a entregar un valor inventado.

## Reglas de cálculo matemático
Cuando el usuario pida promedios, sumas, porcentajes o cualquier cálculo numérico:
- Usa SOLO los valores numéricos que aparecen en los bloques "Estado actual del sensor" e "Histórico reciente" de abajo.
- Muestra brevemente la fórmula (ejemplo: "promedio = (12.4 + 15.1 + 13.8) / 3 = 13.77 m³/h").
- Redondea el resultado a 2 decimales e indica siempre la unidad (m³/h, m/s, m³, etc.).
- Si te falta alguno de los valores necesarios para el cálculo, NO lo completes con estimaciones: responde que no tienes datos suficientes.

${sensorBlock}

${historyBlock}

## Módulos con datos en tiempo real
- **Cintas & Caudal**: sensor LMS511 láser. Todos los datos de flujo, velocidad y volumen que ves arriba corresponden a este módulo.

## IMPORTANTE — límites de tu conocimiento
${isDemoMode
  ? `La plataforma está en MODO DEMO. Los datos de Cintas son reales (LMS511). Los demás módulos (Arcones, Buzones, Acopios, Camiones) muestran datos de ejemplo con fines de demostración comercial. Puedes explicar qué medirían esos módulos en producción real.`
  : `Los módulos Control de Arcones, Monitoreo de Buzones, Acopios Planta y Gestión de Camiones NO tienen conexión a sensores todavía.
Si el usuario pregunta por datos de esos módulos, responde con exactitud: "Ese módulo aún no tiene datos en tiempo real conectados a la plataforma. Solo puedo informarte sobre Cintas & Caudal."
NUNCA inventes cifras ni estimes valores para módulos sin datos. NUNCA digas "aproximadamente" ni uses datos del módulo Cintas para inferir otros módulos.`
}`;
}

const formatText = (text) => {
  // A simple markdown formatter to bold text surrounded by asterisks and handle new lines
  return text.split("\n").map((line, i) => (
    <span key={i}>
      {line
        .split(/(\*\*.*?\*\*)/)
        .map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j}>{part.slice(2, -2)}</strong>
          ) : (
            part
          ),
        )}
      <br />
    </span>
  ));
};

const SUGGESTIONS = [
  "¿Cuál es el flujo actual de la cinta?",
  "¿Cuánto volumen llevamos hoy?",
  "¿Cómo ha sido la producción esta semana?",
  "¿A qué velocidad va la cinta?",
];

const AIAvatar = () => {
  const { latest, history } = useLms511();
  const { demoMode } = usePlatform();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hola, soy AR-I-2, tu asistente IA. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const messagesEndRef = useRef(null);

  // Build a fresh Gemini model instance each time latest/history changes
  const modelRef = useRef(null);
  useEffect(() => {
    if (!apiKey) return;
    const genAI = new GoogleGenerativeAI(apiKey);
    modelRef.current = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: buildSystemInstruction(latest, history, demoMode),
    });
  }, [latest, history, demoMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("ari2_greeting_seen") === "1") return;

    const showTimer = setTimeout(() => setShowGreeting(true), 1500);
    const hideTimer = setTimeout(() => {
      setShowGreeting(false);
      sessionStorage.setItem("ari2_greeting_seen", "1");
    }, 1500 + GREETING_BUBBLE_DURATION_MS);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const dismissGreeting = () => {
    setShowGreeting(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("ari2_greeting_seen", "1");
    }
  };


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSubmit) => {
    const text = typeof textToSubmit === "string" ? textToSubmit : input;
    if (!text.trim()) return;

    const newUserMsg = { role: "user", text };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsLoading(true);

    if (!modelRef.current) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "La clave de la API de Gemini (VITE_GEMINI_API_KEY) no está configurada.",
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const chatHistory = messages.slice(1).map((msg) => ({
        role: msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.text }],
      }));

      const chat = modelRef.current.startChat({ history: chatHistory });
      const result = await chat.sendMessage([{ text }]);
      const responseText = result.response.text();

      setMessages((prev) => [...prev, { role: "model", text: responseText }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Hubo un error de conexión con la IA. Inténtalo más tarde.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          className="relative flex items-center justify-center rounded-full hover:scale-105 transition-transform"
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ rotate: 6 }}
          aria-label="Abrir asistente IA"
        >
          <MiningRobotAvatar size={80} showNotificationDot />
        </motion.button>

        <AnimatePresence>
          {showGreeting && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ duration: 0.4 }}
              className="absolute top-1/2 -translate-y-1/2 right-full mr-2 whitespace-nowrap"
            >
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative rounded-2xl border border-brand-gold/50 bg-brand-darker/95 backdrop-blur text-white text-sm px-5 py-3 pr-7 shadow-[0_0_24px_rgba(212,162,78,0.35)]"
              >
                <span>Hola, soy AR-I-2 👋 ¿En qué puedo ayudarte?</span>
                <button
                  type="button"
                  onClick={dismissGreeting}
                  aria-label="Cerrar saludo"
                  className="absolute top-1.5 right-1.5 text-gray-400 hover:text-white leading-none"
                  style={{ fontSize: "12px", padding: "2px" }}
                >
                  ×
                </button>
                <span
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{
                    right: "-7px",
                    width: 0,
                    height: 0,
                    borderTop: "7px solid transparent",
                    borderBottom: "7px solid transparent",
                    borderLeft: "7px solid rgba(5, 9, 20, 0.95)",
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Interface Modal/Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] z-50 glass-panel rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-brand-gold/20 bg-[#0A0F18]/95 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-brand-gold/10 to-transparent border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <MiningRobotAvatar size={40} />
                <div>
                  <h3 className="font-bold text-white">AR-I-2</h3>
                  <p className="text-xs text-brand-gold flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />{" "}
                    {apiKey ? "Asistente IA · En línea" : "Asistente IA · Sin conexión"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "model" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] text-sm ${
                      msg.role === "model"
                        ? "bg-white/10 rounded-tl-none text-gray-200"
                        : "bg-brand-gold text-black rounded-tr-none"
                    }`}
                  >
                    {formatText(msg.text)}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm text-gray-200 flex items-center space-x-2">
                    <Loader2
                      size={16}
                      className="animate-spin text-brand-gold"
                    />
                    <span>Analizando...</span>
                  </div>
                </div>
              )}

              {/* Suggestions - Only show if it's the start (1 message) */}
              {messages.length === 1 && (
                <div className="flex flex-col space-y-2 mt-4">
                  <p className="text-xs text-gray-500 uppercase font-bold ml-1">
                    Sugerencias:
                  </p>
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      className="text-left text-xs p-3 rounded-xl bg-white/5 hover:bg-brand-gold/10 hover:text-brand-gold border border-white/5 transition-colors"
                      onClick={() => handleSend(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu consulta..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-gold text-black rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAvatar;
