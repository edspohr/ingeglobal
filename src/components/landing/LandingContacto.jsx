import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';

const CONTACT_ITEMS = [
  { icon: Phone, text: '+569 8158 6984' },
  { icon: Phone, text: '+569 877 65359' },
  { icon: Mail, text: 'gerencia@ingeglobal.cl' },
  { icon: Mail, text: 'info@ingeglobal.cl' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut', delay },
});

const inputClass =
  'bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold/50 w-full text-sm transition-colors';

export default function LandingContacto() {
  const [form, setForm] = useState({
    nombre: '', empresa: '', email: '', telefono: '', mensaje: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ nombre: '', empresa: '', email: '', telefono: '', mensaje: '' });
  };

  return (
    <section id="contacto" className="py-24 px-6 bg-[#0A0F18]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div {...fadeUp(0)} className="flex justify-center mb-6">
            <span className="bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
              Contacto
            </span>
          </motion.div>
          <motion.h2 {...fadeUp(0.1)} className="text-4xl font-bold text-white">
            ¿Necesitas una solución a medida?
          </motion.h2>
          <motion.p {...fadeUp(0.2)} className="text-gray-400 mt-4 max-w-xl mx-auto">
            Cuéntanos tu requerimiento. Un ejecutivo se pondrá en contacto dentro de 24 horas.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT: Form */}
          <motion.div {...fadeUp(0.15)}>
            {submitted ? (
              <div className="flex items-center justify-center h-full min-h-[320px]">
                <p className="text-emerald-400 text-lg font-semibold text-center">
                  ✓ Mensaje enviado. Te contactaremos pronto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre completo"
                  required
                  value={form.nombre}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  type="text"
                  name="empresa"
                  placeholder="Empresa"
                  value={form.empresa}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  value={form.telefono}
                  onChange={handleChange}
                  className={inputClass}
                />
                <textarea
                  name="mensaje"
                  placeholder="Mensaje"
                  rows={4}
                  required
                  value={form.mensaje}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
                <button
                  type="submit"
                  className="w-full bg-brand-gold text-black font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(212,162,78,0.3)] transition-all mt-2"
                >
                  Enviar Solicitud
                </button>
              </form>
            )}
          </motion.div>

          {/* RIGHT: Info card */}
          <motion.div {...fadeUp(0.25)}>
            <div className="glass-panel p-8 rounded-2xl h-full">
              <h3 className="text-white font-bold text-lg mb-6">Información de contacto</h3>

              <ul>
                {CONTACT_ITEMS.map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0"
                  >
                    <Icon className="w-4 h-4 text-brand-gold flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{text}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => window.open('https://wa.me/56981586984', '_blank')}
                className="w-full mt-6 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] rounded-xl px-6 py-3 font-semibold text-sm hover:bg-[#25D366]/20 transition-colors"
              >
                O escríbenos directo por WhatsApp
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
