import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut', delay },
});

const STATS = [
  '18 años de experiencia',
  'Tecnología LiDAR',
  'Datos en tiempo real',
];

export default function LandingHero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center pt-[72px] overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0F1E3C 0%, #050914 70%)',
        backgroundImage: `
          radial-gradient(ellipse at center, #0F1E3C 0%, #050914 70%),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/%3E%3C/svg%3E")
        `,
        backgroundBlendMode: 'normal',
      }}
    >
      {/* Animated grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center w-full py-20">

        {/* Eyebrow pill */}
        <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            ● Sistema Operativo en Vivo
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          {...fadeUp(0.15)}
          className="text-5xl md:text-7xl font-black text-white leading-tight"
        >
          Inteligencia Operacional
          <br />
          para la Industria{' '}
          <span className="text-gradient-gold">Minera</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.3)}
          className="text-lg text-gray-400 max-w-2xl mx-auto mt-6"
        >
          Monitoreo en tiempo real de cintas, arcones, camiones y acopios.
          Toma decisiones basadas en datos, no en suposiciones.
        </motion.p>

        {/* CTA group */}
        <motion.div
          {...fadeUp(0.45)}
          className="mt-10 flex gap-4 justify-center flex-wrap"
        >
          <a
            href="#contacto"
            className="bg-brand-gold text-black font-bold px-8 py-4 rounded-xl hover:shadow-[0_0_30px_rgba(212,162,78,0.4)] transition-all text-base"
          >
            Solicitar Demo
          </a>
          <a
            href="#servicios"
            className="border border-white/20 text-white px-8 py-4 rounded-xl hover:bg-white/5 transition-all text-base"
          >
            Ver Módulos
          </a>
        </motion.div>

        {/* Stat chips */}
        <motion.div
          {...fadeUp(0.6)}
          className="mt-16 flex items-center justify-center gap-8 flex-wrap"
        >
          {STATS.map((stat, i) => (
            <React.Fragment key={stat}>
              <span className="text-gray-500 text-sm">{stat}</span>
              {i < STATS.length - 1 && (
                <span className="w-px h-4 bg-brand-gold/40 hidden sm:block" />
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
