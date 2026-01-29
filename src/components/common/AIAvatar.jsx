import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAvatar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const SUGGESTIONS = [
    "¿Cuál fue el rendimiento de ayer?",
    "Calcula el volumen acumulado semana actual",
    "Analiza la eficiencia de la Planta 2", 
    "Reportar incidente en Cinta 3"
  ];

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
                            <Sparkles className="w-3 h-3 mr-1" /> En línea
                        </p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {/* Bot Welcome */}
                <div className="flex justify-start">
                    <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm text-gray-200">
                        Hola, soy tu asistente de operaciones. ¿Qué necesitas analizar hoy?
                    </div>
                </div>

                {/* Suggestions */}
                <div className="flex flex-col space-y-2 mt-4">
                    <p className="text-xs text-gray-500 uppercase font-bold ml-1">Sugerencias:</p>
                    {SUGGESTIONS.map((s, i) => (
                        <button key={i} className="text-left text-xs p-3 rounded-xl bg-white/5 hover:bg-brand-gold/10 hover:text-brand-gold border border-white/5 transition-colors">
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Escribe tu consulta..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-gold text-black rounded-lg hover:bg-white transition-colors">
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
