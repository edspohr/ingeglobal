import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as mockData from "../../data/mockData";

// Initialize Gemini
// We only initialize the client if the API key is present
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
let model = null;
if (apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: `Eres un asistente virtual de IA integrado en la plataforma web de gestión minera/industrial "Ingeglobal".
Tu objetivo es responder a las preguntas del usuario siendo breve, profesional y basándote EXCLUSIVAMENTE en los siguientes datos proporcionados en formato JSON: 

${JSON.stringify(mockData)}

Instrucciones adicionales:
- No inventes incidentes, métricas o vehículos que no figuren en los datos.
- Responde de forma fácil de leer: usa viñetas, saltos de línea y negritas para resaltar lo importante.
- Si te hacen una pregunta fuera de contexto de las operaciones, métricas o la app, contesta amablemente que estás diseñado solo para asistir en esto.
- Si el usuario te saluda, hazlo cordialmente.
`,
  });
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

const AIAvatar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hola, soy tu asistente de operaciones. ¿Qué necesitas analizar hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const SUGGESTIONS = [
    "¿Cuál es el volumen diario actual?",
    "¿Hay incidentes críticos reportados?",
    "¿Qué camiones están procesando?",
    "Resumen de los arcones",
  ];

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

    if (!model) {
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
      // Exclude the fixed first greeting from the history sent to the API
      const history = messages.slice(1).map((msg) => ({
        role: msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.text }],
      }));

      const chat = model.startChat({ history });
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
      <motion.button
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-brand-gold to-yellow-600 shadow-[0_0_20px_rgba(212,162,78,0.5)] border-2 border-white/20 text-black hover:scale-105 transition-transform"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ rotate: 10 }}
      >
        <Bot size={32} />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-brand-gold"></span>
        </span>
      </motion.button>

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
                <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center border border-brand-gold/30">
                  <Bot className="text-brand-gold w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Asistente IA</h3>
                  <p className="text-xs text-brand-gold flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />{" "}
                    {model ? "En línea" : "Sin conexión"}
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
