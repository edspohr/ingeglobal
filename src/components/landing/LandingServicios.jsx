import React from 'react';
import { motion } from 'framer-motion';
import {
  Scan, Map, Satellite, Layers, Cpu, Leaf, Camera, Volume2, Droplets,
  Activity, Database, Truck, Box,
} from 'lucide-react';

const SERVICIOS = [
  {
    icon: Scan,
    title: 'Escáner Láser 3D',
    desc: 'Captura de nubes de puntos de alta densidad para modelado tridimensional preciso.',
  },
  {
    icon: Map,
    title: 'Topografía Clásica',
    desc: 'Levantamientos planimétricos y altimétricos con instrumentación de última generación.',
  },
  {
    icon: Satellite,
    title: 'GPS de Alta Precisión',
    desc: 'Posicionamiento geodésico diferencial con precisión centimétrica en tiempo real.',
  },
  {
    icon: Camera,
    title: 'Fotogrametría',
    desc: 'Generación de ortofotografías y modelos 3D a partir de capturas aéreas y terrestres.',
  },
  {
    icon: Cpu,
    title: 'Geofísica',
    desc: 'Prospección del subsuelo mediante métodos eléctricos, sísmicos y electromagnéticos.',
  },
  {
    icon: Leaf,
    title: 'Agricultura de Precisión',
    desc: 'Análisis geoespacial de cultivos para optimizar rendimientos y recursos hídricos.',
  },
  {
    icon: Volume2,
    title: 'Imágenes Aéreas (Drone)',
    desc: 'Vuelos fotogramétricos con drones de precisión para inspección y cartografía.',
  },
  {
    icon: Layers,
    title: 'Cálculo de Volúmenes',
    desc: 'Cubicación de acopios, minas y movimientos de tierra con precisión topográfica.',
  },
  {
    icon: Droplets,
    title: 'Aguas Subterráneas',
    desc: 'Evaluación geológica e hidrogeológica para detección y aprovechamiento de acuíferos.',
  },
];

const MODULOS = [
  {
    icon: Activity,
    name: 'Cintas & Caudal',
    desc: 'Monitoreo de flujo en tiempo real',
  },
  {
    icon: Database,
    name: 'Control Arcones',
    desc: 'Niveles y consumos por material',
  },
  {
    icon: Truck,
    name: 'Gestión Camiones',
    desc: 'Registro de entradas y cargas',
  },
  {
    icon: Layers,
    name: 'Monitoreo Buzones',
    desc: 'Estado y nivel de llenado',
  },
  {
    icon: Box,
    name: 'Acopios Planta',
    desc: 'Topografía volumétrica integrada',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function LandingServicios() {
  return (
    <section id="servicios" className="py-24 px-6 bg-[#0A0F18]">
      <div className="max-w-7xl mx-auto">

        {/* ── Part A: Servicios de Terreno ── */}
        <div className="text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center mb-6"
          >
            <span className="bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
              Nuestros Servicios
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl font-bold text-white"
          >
            Geomensura de alta precisión
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-gray-400 mt-4 max-w-xl mx-auto"
          >
            18 años integrando las últimas tecnologías de captura de datos para la industria.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          {SERVICIOS.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className="glass-card p-6 rounded-xl"
            >
              <div className="bg-brand-gold/10 rounded-lg p-3 w-fit">
                <Icon className="w-6 h-6 text-brand-gold" />
              </div>
              <h3 className="text-white font-semibold mt-4">{title}</h3>
              <p className="text-gray-400 text-sm mt-2">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Separator ── */}
        <hr className="border-white/5 my-16" />

        {/* ── Part B: La Plataforma ── */}
        <div className="text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center mb-6"
          >
            <span className="bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
              Ingeglobal Platform
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl font-bold text-white"
          >
            Todos tus datos operacionales,{' '}
            <span className="text-gradient-gold">en un solo lugar</span>
          </motion.h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12"
        >
          {MODULOS.map(({ icon: Icon, name, desc }) => (
            <motion.div
              key={name}
              variants={cardVariants}
              className="glass-card p-6 rounded-xl border-t-2 border-t-brand-gold/30"
            >
              <div className="bg-brand-gold/10 rounded-lg p-3 w-fit">
                <Icon className="w-5 h-5 text-brand-gold" />
              </div>
              <h3 className="text-white font-semibold mt-4 text-sm">{name}</h3>
              <p className="text-gray-400 text-xs mt-1">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
