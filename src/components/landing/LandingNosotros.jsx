import React from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { value: '18+', label: 'Años' },
  { value: '9', label: 'Servicios' },
  { value: '2', label: 'Teléfonos directos' },
];

const TECNOLOGIAS = [
  'LiDAR Terrestre',
  'Drones de Precisión',
  'GPS Diferencial',
  'Fotogrametría Aérea',
  'Análisis Geofísico',
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut', delay },
});

export default function LandingNosotros() {
  return (
    <section id="nosotros" className="py-24 px-6 bg-brand-darker">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── Left: Text column ── */}
        <div>
          <motion.div {...fadeUp(0)} className="mb-6">
            <span className="bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
              Sobre Nosotros
            </span>
          </motion.div>

          <motion.h2
            {...fadeUp(0.1)}
            className="text-4xl font-bold text-white leading-tight"
          >
            Especialistas en geomensura con tecnología de vanguardia
          </motion.h2>

          <motion.p {...fadeUp(0.2)} className="text-gray-400 mt-6 leading-relaxed">
            Somos especialistas en el uso de escáner láser móvil y estático, utilizando las últimas
            técnicas de recolección de datos en terreno para entregar información precisa y confiable
            a la industria minera, construcción y sector agrícola.
          </motion.p>

          <motion.p {...fadeUp(0.3)} className="text-gray-400 mt-4 leading-relaxed">
            Con 18 años de experiencia en geomensura, ofrecemos productos de alto estándar de calidad
            con atención personalizada y directa, adaptándonos a los requerimientos específicos de
            cada proyecto.
          </motion.p>

          {/* Stat counters */}
          <motion.div
            {...fadeUp(0.4)}
            className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-white/5"
          >
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-4xl font-black text-brand-gold">{value}</p>
                <p className="text-gray-400 text-sm mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: Tech card ── */}
        <motion.div
          {...fadeUp(0.2)}
          className="relative"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-brand-gold/5 rounded-2xl blur-2xl pointer-events-none" />

          <div className="relative glass-panel p-8 rounded-2xl">
            <h3 className="text-white font-bold text-lg mb-4">Tecnologías que usamos</h3>
            <ul>
              {TECNOLOGIAS.map((tech, i) => (
                <li
                  key={tech}
                  className={`flex items-center gap-3 py-3 text-gray-300 text-sm ${
                    i < TECNOLOGIAS.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
